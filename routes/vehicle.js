const express = require('express');
const app =  express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport');


const VehicleController = require('../controllers/VehicleController');


//mobile app api
app.post('/mobile/login', VehicleController.postMobileLogin);
app.post('/mobile/register', VehicleController.create);

module.exports = app;