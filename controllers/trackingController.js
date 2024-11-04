const db = require("../config/db");
const axios = require("axios");
const Validator = require("validatorjs");
const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/addPaxMapping", [authenticateToken], async (req, res) => {
  const validation = new Validator(req.body, {
    pax_id: "required|string",
    shipment_id: "required|string",
  });

  if (validation.fails()) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: helper.firstErrorValidatorjs(validation),
      status: "error",
    });
  }

  const { pax_id, shipment_id } = req.body;
  let transaction;

  try {
    transaction = await db.transaction();

    await db.query("INSERT INTO pax_mapping (pax_id, shipment_id) VALUES (:pax_id, :shipment_id)", {
      replacements: { pax_id, shipment_id },
      type: db.QueryTypes.INSERT,
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      code: 201,
      message: "Pax ID and Shipment ID added successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Error adding Pax ID and Shipment ID:", error);

    if (transaction) {
      await transaction.rollback();
    }

    return res.status(500).json({
      code: 500,
      message: "Error adding Pax ID and Shipment ID",
      status: "error",
      error: error.stack,
    });
  }
});

router.get("/getTrackingDetailsByPaxId/:pax_id", async (req, res) => {
  const validation = new Validator(req.params, {
    pax_id: "required|string",
  });

  if (validation.fails()) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: helper.firstErrorValidatorjs(validation),
      status: "error",
    });
  }

  const { pax_id } = req.params;

  try {
    const paxQuery = "SELECT shipment_id FROM pax_mapping WHERE pax_id = :pax_id";
    const rows = await db.query(paxQuery, {
      replacements: { pax_id },
      type: db.QueryTypes.SELECT,
    });

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Shipment not found for this paxId",
        status: "error",
      });
    }

    const shipment_id = rows[0].shipment_id;

    const shipGlobalApiUrl = "https://app.shipglobal.in/apiv1/tools/tracking";
    const payload = {
      tracking: shipment_id,
    };

    const response = await axios.post(shipGlobalApiUrl, payload, {
      headers: {
        Authorization: "Basic MTd0cmFja0BzaGlwZ2xvYmFsLmluOlV0XXlrUCo4VTF2MGU1Tg==",
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      code: 200,
      data: response.data,
      status: "success",
    });
  } catch (error) {
    console.error("Error fetching tracking details:", error);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Error fetching tracking details",
      status: "error",
      error: error.stack,
    });
  }
});

module.exports = router;
