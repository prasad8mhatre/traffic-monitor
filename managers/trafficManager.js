const mongoose = require('mongoose');

const TrafficGraphController = require('../controllers/TrafficGraphController');
const RoadController = require('../controllers/RoadController');

var Road = require('../models/Road').Road;
const TrafficGraph = require('../models/TrafficGraph').TrafficGraph;

const osmManager = require('../managers/osmManager');
const pubnubManager = require('../managers/pubnubManager');
var _this = this;


exports.calculateTraffic = function(trafficUpdate) {
    return new Promise(function(fulfill, reject) {
        var globalTrafficMap = osmManager.getGloabalTrafficMap();
        
        var road = globalTrafficMap.get(trafficUpdate.edgeId + "");

        if (road != null && road != undefined) {
            console.log("**********traffic update: " + JSON.stringify(trafficUpdate));

            var vehicle = {};
            vehicle.uuid = trafficUpdate.uuid;
            vehicle.timestamp = trafficUpdate.timestamp;
            vehicle.edgeId = trafficUpdate.edgeId;
           
            if (road.vehicles == undefined) {
                road.vehicles = [];
            }
            if(!_this.isPresent(road, vehicle)){
              road.vehicles.push(JSON.stringify(vehicle));
            }
            

            road.weight = calculateWeight(road, trafficUpdate);
            road.speed = smoothSpeed(road, trafficUpdate);
            if (road.vehicle_count == null || road.vehicle_count == undefined) {
                road.vehicle_count = 0;
            }
            road.vehicle_count = road.vehicle_count + 1;
            road.isCongestion = detectCongestion(road);
            road.color = setColor(road);

            //TODO:send traffic congestion notification

            if(road.isCongestion){
                sendNotification(road);
            }

            console.log("road: " + JSON.stringify(road));
            if (road != null) {
                RoadController.updateRoad(road).then(function(resp) {
                    console.log("**********response:" + resp);
                    fulfill(resp);
                }, function(err) {
                    console.log("Road Query Error:" + err);
                    reject(err); // 500 error
                });
            }
        }else{
            reject("No RoadId Found"); 
        }

    });
};

exports.isPresent = function(road, trafficUpdate) {
    var found = false;
    road.vehicles.forEach(function(val){
        var vehicle = JSON.parse(val);
        if(vehicle.uuid == trafficUpdate.uuid){
            found = true;
        }
    });
    return found;
}

var sendNotification = function (road) {
    //send notification to adjacent road id on pubnub channel
    /*
    1. send message on global_traffic channel
    */
    debugger;
    var msg = {};
    msg.code = 101;
    msg.text = "Congestion at Road Id:" + road.roadId;
    msg.roadId  = road.roadId;
    msg.isCar = false;
    pubnubManager.publishMessage(msg);

}




var calculateWeight = function(road, trafficUpdate) {
    /*cost function = (d, cl, n, f)
    d = distance
    Cl = car length (3.2 to 5m ) = 4m
    N = no. of cars
    f = fuel consumption (10km/ltr.) = 0.001 ltr/m
    Ex. d = 100m, cl = 4m, N = 4, f= 0.001 ltr/m
    Cost = (d*f )+ (cl*N) = 16.4*/

    var car_length = process.env.car_length;
    var empty_car_space = process.env.empty_car_space;
    var fuel_consumption = process.env.fuel_consumption;

    //TODO: Smooth with historical data and output the result
    return (road.length * fuel_consumption) + (car_length * road.vehicles.length);
}

var smoothSpeed = function(road, trafficUpdate) {
    var speed = 0;
    if (road.speed != null) {
        speed = (road.speed + trafficUpdate.speed) / 2;
    }
    //TODO: smooth the speed	
    return speed;
}

var getCurrentRoadDensity = function(carCount){
    var car_length = process.env.car_length;
    var empty_car_space = process.env.empty_car_space;

    return carCount * (car_length + empty_car_space);
}

var detectCongestion = function(road) {

    //Need to change for simulation
    console.log("Road:" + JSON.stringify(road));
    console.log("Road desity: " + (getCurrentRoadDensity(road.vehicles.length) > road.capacity) );
    console.log("Road Speed :" + (road.speed < 30));
    if ((getCurrentRoadDensity(road.vehicles.length) > road.capacity)  && road.speed < 30) {
        return true;
    } else {
        return false;
    }
};

var setColor = function(road) {
    /*Green means there are no traffic delays.
    Orange means there's a medium amount of traffic.
    Red means there are traffic delays. 
    GREY means no traffic density/ update found.
    The more red, the slower the speed of traffic on the road.*/
    var carDensity = getCurrentRoadDensity(road.vehicles.length);

    if (carDensity > road.capacity && (road.speed < 30)) {
        return "RED";
    } else if (carDensity > (road.capacity / 2)  ) {
        return "ORANGE";
    } else if(carDensity < (road.capacity / 2))  {
        return "GREEN";
    }else{
        return "GREY";
    }
}



/*exports.getTraffic = function(color){
    debugger;
    console.log("**********get traffic:" + setColor);
    return new Promise(function(fulfill, reject) {
        RoadController.getTraffic(color).then(function(resp) {
            console.log("**********response:" + resp);
            //create geojson 


            fulfill(getGeoJson(resp));
        }, function(err) {
            console.log("Road Query Error:" + err);
            reject(err); // 500 error
        });

    });
}


var getGeoJson = function(resp){
    var geoJson = {};
    geojson.type = "FeatureCollection";
    geojson.features = [];

    resp.forEach(function(val, index) {
      var feature = {};
      feature.type = "Feature";
      feature.id = val.id;
      feature.geometry = {};
      feature.geometry.type = "LineString";
      var start = JSON.parse(resp.start);
      var end = JSON.parse(resp.end);
      var cod1 = [];
      cod1.push(parseInt(start.lon));
      cod1.push(parseInt(start.lat)); 
      var cod2 = [];
      cod2.push(parseInt(end.lon));
      cod2.push(parseInt(end.lat));
      feature.geometry.coordinates = [];
      feature.geometry.coordinates.push(cod1);
      feature.geometry.coordinates.push(cod2);
    });
    
}



*/