module.exports = function (app) {

    app.use('/addShipment', require('../controllers/trackingController'));

    app.use('/addPaxMapping', require('../controllers/trackingController'));

    app.use('/auth', require('../controllers/authController'));

}
