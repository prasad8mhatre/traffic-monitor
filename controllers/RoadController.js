'use strict';

var Road = require('../models/Road').Road;

exports.create = function (req, res) {
    Road.create(req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.get = function (req, res) {
    Road.get({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getAll = function (req, res) {
    Road.getAll({}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.update = function (req, res) {
    Road.updateById(req.params.id, req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
}

exports.delete = function (req, res) {

    Road.removeById({_id: req.params.id}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
}


//Controller methods

exports.createRoad = function (road) {
    return new Promise(function (fulfill, reject){
        Road.create(road, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.getRoad = function (road) {
    return new Promise(function (fulfill, reject){    
        Road.get({_id: road.id}, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.getAllRoad = function () {
    return new Promise(function (fulfill, reject){    
        Road.getAll({}, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.updateRoad = function (road) {
    return new Promise(function (fulfill, reject){   
        Road.updateById(road.roadId, road, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
}

exports.deleteRoad = function (road) {
    return new Promise(function (fulfill, reject){   
        Road.removeById({_id: road.id}, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
}


exports.getTraffic = function (color) {
    return new Promise(function (fulfill, reject){    
        Road.getAll({color: color}, function(err, result) {
            if (!err) {
                console.log("FResult getTraffic" + JSON.stringify(result))
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};
