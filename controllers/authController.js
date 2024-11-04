const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
require("dotenv").config();

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        status: "error",
        message: "Username and password are required!",
        code: "400",
      });
    }

    let result = await db.query("SELECT * FROM `users` WHERE `username` = :username", { replacements: { username }, type: db.QueryTypes.SELECT });

    if (result.length === 0) {
      return res.json({
        status: "error",
        message: "No account found for the provided username.",
        code: "404",
      });
    }

    const foundUser = result[0];

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      if (foundUser.password === password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("UPDATE `users` SET `password` = :hashedPassword WHERE `id` = :id", { replacements: { hashedPassword, id: foundUser.id }, type: db.QueryTypes.UPDATE });
      } else {
        return res.json({
          status: "error",
          message: "Invalid username or password.",
          code: "401",
        });
      }
    }

    const token = jwt.sign({ id: foundUser.id, username: foundUser.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      status: "success",
      message: "Login successful!",
      code: 200,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.json({
      status: "error",
      message: "An error occurred during login.",
      code: "500",
      err: error.message,
    });
  }
});

module.exports = router;
