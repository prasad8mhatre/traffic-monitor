'use strict';

var Vehicle = require('../models/Vehicle').Vehicle;
const request = require('request');

exports.create = function(req, res) {
    var vehicle = {};
    vehicle.vehicleId = req.query.vehicleId;
    vehicle.password = req.query.password;
    vehicle.isActive = true;
    Vehicle.create(vehicle, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.get = function(req, res) {
    Vehicle.get({ _id: req.params.id }, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getAll = function(req, res) {
    Vehicle.getAll({}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.update = function(req, res) {
    Vehicle.updateById(req.params.id, req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
}

exports.delete = function(req, res) {

    Vehicle.removeById({ _id: req.params.id }, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
}

//login

exports.postMobileLogin = function(req, res) {
    Vehicle.get({ 'vehicleId': req.query.vehicleId }, function(err, result) {
        if (!err && result[0] != undefined) {
            if(result[0].password == req.query.password && result[0].isActive){
                return res.send(true);
            }else{
                 return res.send(false);
            }
        } else {
            return res.send(err); // 500 error
        }
    });
    
}




