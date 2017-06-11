'use strict';

var TrafficGraph = require('../models/TrafficGraph').TrafficGraph;
const trafficManager = require('../managers/trafficManager');
var _this = this;

exports.create = function (req, res) {
    TrafficGraph.create(req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.get = function (req, res) {
    TrafficGraph.get({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getAll = function (req, res) {
    TrafficGraph.getAll({}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.update = function (req, res) {
    TrafficGraph.updateById(req.params.id, req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
}

exports.delete = function (req, res) {
    TrafficGraph.removeById({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
}


//controller methods

exports.createTrafficMap = function (edge) {
    return new Promise(function (fulfill, reject){   
        TrafficGraph.create(edge, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.getTrafficMap = function (edge) {
    return new Promise(function (fulfill, reject){   
        TrafficGraph.get({roadId: edge.roadId}, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.getAllTrafficMap = function () {
    return new Promise(function (fulfill, reject){   
        TrafficGraph.getAll({}, function(err, result) {
           if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.updateTrafficMap = function (edge) {
    return new Promise(function (fulfill, reject){  
        TrafficGraph.updateById(edge.roadId, edge, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
}

exports.deleteTrafficMap = function (edge) {
    return new Promise(function (fulfill, reject){  
        TrafficGraph.removeById({_id: edge.id}, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
}

exports.addTrafficData = function(req, res){
    //get lat lon and find edge
    debugger;
    var trafficUpdate = _this.createTraffic(req.body);
    trafficManager.calculateTraffic(trafficUpdate).then(function(result){
        console.log("CalculateTraffic result:" + result);
        return res.json(result);
    }, function(err){
        console.log("CalculateTraffic Error:" + err);
        return res.json(err);
    });
}

exports.createTraffic = function(traffic) {
    var trafficUpdate = {};
    trafficUpdate.location = {};
    trafficUpdate.location.lat = traffic.lat;
    trafficUpdate.location.long = traffic.long;
    trafficUpdate.speed = traffic.speed;
    trafficUpdate.vehiclePubNubId = traffic.vehiclePubNubId;
    trafficUpdate.timestamp = new Date();
    trafficUpdate.edgeId = traffic.edgeId;
    return trafficUpdate;
}

/*exports.getGreenTraffic =function(req, res){
    trafficManager.getTraffic("GREEN").then(function(result){
        console.log("green traffic result:" + result);
        return res.json(result);
    }, function(err){
        console.log("green traffic Error:" + err);
        return res.json(err);
    });
}

exports.getRedTraffic =function(req, res){
    debugger;
    console.log("************ getRedTraffic: " + req);
    trafficManager.getTraffic("RED").then(function(result){
        console.log("RED traffic result:" + result);
        return res.json(result);
    }, function(err){
        console.log("RED traffic Error:" + err);
        return res.json(err);
    });
}

exports.getOrangeTraffic =function(req, res){
    trafficManager.getTraffic("ORANGE").then(function(result){
        console.log("ORANGE traffic result:" + result);
        return res.json(result);
    }, function(err){
        console.log("ORANGE traffic Error:" + err);
        return res.json(err);
    });
}*/

