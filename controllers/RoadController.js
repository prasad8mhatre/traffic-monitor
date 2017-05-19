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
    Road.create(road, function(err, result) {
        if (!err) {
            return JSON.stringify(result);
        } else {
            return JSON.stringify(err); // 500 error
        }
    });
};

exports.getRoad = function (road) {
    Road.get({_id: road.id}, function(err, result) {
        if (!err) {
            return JSON.stringify(result);
        } else {
            return JSON.stringify(err); // 500 error
        }
    });
};

exports.getAllRoad = function () {
    Road.getAll({}, function(err, result) {
        if (!err) {
            return JSON.stringify(result);
        } else {
            return JSON.stringify(err); // 500 error
        }
    });
};

exports.updateRoad = function (road) {
    Road.updateById(road.id, road, function(err, result) {
        if (!err) {
            return JSON.stringify(result);
        } else {
            return JSON.stringify(err); // 500 error
        }
    });
}

exports.deleteRoad = function (road) {
    Road.removeById({_id: road.id}, function(err, result) {
        if (!err) {
            return JSON.stringify(result);
        } else {
            console.log(err);
            return JSON.stringify(err); // 500 error
        }
    });
}
