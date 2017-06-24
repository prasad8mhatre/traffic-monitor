'use strict';

var Road = require('../models/Road').Road;
const request = require('request');

exports.create = function(req, res) {
    Road.create(req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.get = function(req, res) {
    Road.get({ _id: req.params.id }, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.getAll = function(req, res) {
    Road.getAll({}, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
};

exports.update = function(req, res) {
    Road.updateById(req.params.id, req.body, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            return res.send(err); // 500 error
        }
    });
}

exports.delete = function(req, res) {

    Road.removeById({ _id: req.params.id }, function(err, result) {
        if (!err) {
            return res.json(result);
        } else {
            console.log(err);
            return res.send(err); // 500 error
        }
    });
}


//Controller methods

exports.createRoad = function(road) {
    return new Promise(function(fulfill, reject) {
        Road.create(road, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.getRoad = function(road) {
    return new Promise(function(fulfill, reject) {
        Road.get({ _id: road.id }, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.getAllRoad = function() {
    return new Promise(function(fulfill, reject) {
        Road.getAll({}, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};

exports.updateRoad = function(road) {
    return new Promise(function(fulfill, reject) {
        Road.updateById(road.roadId, road, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
}

exports.deleteRoad = function(road) {
    return new Promise(function(fulfill, reject) {
        Road.removeById({ _id: road.id }, function(err, result) {
            if (!err) {
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
}


/*exports.getTraffic = function (color) {
    debugger;
    return new Promise(function (fulfill, reject){    
        Road.getAll({color: color}, function(err, result) {
            debugger;
            if (!err) {
                console.log("FResult getTraffic" + JSON.stringify(result))
                fulfill(JSON.stringify(result));
            } else {
                reject(JSON.stringify(err)); // 500 error
            }
        });
    });
};*/


exports.getGreenTraffic = function(req, res) {
    Road.getAll({ color: "GREEN" }, function(err, result) {
        if (!err) {
            return res.json(geoJsonConverter(result));
        } else {
            return res.send(err); // 500 error
        }
    });
}

exports.getRedTraffic = function(req, res) {
    Road.getAll({ color: "RED" }, function(err, result) {
        if (!err) {
            return res.json(geoJsonConverter(result));
        } else {
            return res.send(err); // 500 error
        }
    });

}

exports.getOrangeTraffic = function(req, res) {
    Road.getAll({ color: "ORANGE" }, function(err, result) {
        if (!err) {
            return res.json(geoJsonConverter(result));
        } else {
            return res.send(err); // 500 error
        }
    });

}


var geoJsonConverter = function(resp){
    var geoJson = {};
    geoJson.type = "FeatureCollection";
    geoJson.features = [];

    resp.forEach(function(val, index) {
      var feature = {};
      feature.type = "Feature";
      feature.id = val.id;
      feature.geometry = {};
      feature.geometry.type = "LineString";
      feature.color = val.color;
      var start = JSON.parse(val.start);
      var end = JSON.parse(val.end);
      var cod1 = [];
      cod1.push(start.lon);
      cod1.push(start.lat); 
      var cod2 = [];
      cod2.push(end.lon);
      cod2.push(end.lat);
      feature.geometry.coordinates = [];
      feature.geometry.coordinates.push(cod1);
      feature.geometry.coordinates.push(cod2);
      geoJson.features.push(feature);
    });
    return geoJson;
    
}


exports.getRoadId = function(req, res) {
    if(req.query.lat != undefined && req.query.long != undefined){
        var url = 'http://locationiq.org/v1/reverse.php?format=json&key=' + process.env.locationIQ +'&lat='+ req.query.lat +'&lon=' + req.query.long + '&addressdetails=1';

        request(url, function (error, response, body) {
         
          if (!error) {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            console.log('body:', body); // Print the HTML for the Google homepage. 
            return res.json(body);
          } else {
            console.log('error:', error); // Print the error if one occurred
            return res.send(error); // 500 error
          }
          
        });
    }else{
        res.status(500).send({ error: 'Location Missing!' })
    }
    
    
};
