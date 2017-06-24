const express = require('express');
const app =  express.Router();
const passport = require('passport');
const passportConfig = require('../config/passport');


const TrafficGraphController = require('../controllers/TrafficGraphController');
const RoadController = require('../controllers/RoadController');




//traffic
app.post('/trafficGraph', passportConfig.isAuthenticated, TrafficGraphController.create);
app.get('/trafficGraph/:id', passportConfig.isAuthenticated, TrafficGraphController.get);
app.get('/trafficGraph', passportConfig.isAuthenticated, TrafficGraphController.getAll);
app.put('/trafficGraph/:id', passportConfig.isAuthenticated, TrafficGraphController.update);
app.delete('/trafficGraph/:id', passportConfig.isAuthenticated, TrafficGraphController.delete);

//road
app.post('/road', passportConfig.isAuthenticated, RoadController.create);
app.get('/road/:id', passportConfig.isAuthenticated, RoadController.get);
app.get('/road', passportConfig.isAuthenticated, RoadController.getAll);
app.put('/road/:id', passportConfig.isAuthenticated, RoadController.update);
app.delete('/road/:id', passportConfig.isAuthenticated, RoadController.delete);

app.post('/locationUpdate', passportConfig.isAuthenticated, TrafficGraphController.addTrafficData);
app.get('/getGreenTraffic', passportConfig.isAuthenticated, RoadController.getGreenTraffic);
app.get('/getRedTraffic', passportConfig.isAuthenticated, RoadController.getRedTraffic);
app.get('/getOrangeTraffic', passportConfig.isAuthenticated, RoadController.getOrangeTraffic);
app.get('/getRoadId', passportConfig.isAuthenticated, RoadController.getRoadId);

module.exports = app;




