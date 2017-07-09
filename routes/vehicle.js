const express = require('express');
const app =  express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport');


const VehicleController = require('../controllers/VehicleController');


//mobile app api
app.post('/mobile/login', VehicleController.postMobileLogin);
app.post('/mobile/register', VehicleController.create);
app.get('/mobile/getAllVehicles', VehicleController.getAll);
app.post('/mobile/updateVehicle', VehicleController.update);

module.exports = app;