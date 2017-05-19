const osmread = require('osm-read');
const mongoose = require('mongoose');

const TrafficGraphController = require('../controllers/TrafficGraphController');
const RoadController = require('../controllers/RoadController');


var Road = require('../models/Road').Road;
const TrafficGraph = require('../models/TrafficGraph').TrafficGraph;


this.TrafficGraphMap = {};

/*
Haversine
formula:  a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2( √a, √(1−a) )
d = R ⋅ c
where φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
note that angles need to be in radians to pass to trig functions!

Ref: http://www.movable-type.co.uk/scripts/latlong.html
*/


if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}


var calDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // metres
    var φ1 = lat1.toRad();
    var φ2 = lat2.toRad();
    var Δφ = (lat2 - lat1).toRad();
    var Δλ = (lon2 - lon1).toRad();

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //in meters
    return R * c;
}

var setAdjacentRoadId = function(globalTrafficMap) {
    console.log("size:" + globalTrafficMap.size);

    var tempGlobalMap = new Map();
    for (var [currentkey, currentValue] of globalTrafficMap.entries()) {
        for (var [key, value] of globalTrafficMap.entries()) {
            if ((JSON.parse(currentValue.start).lat == JSON.parse(value.end).lat && JSON.parse(currentValue.start).lon == JSON.parse(value.end).lon) ||
                (JSON.parse(currentValue.end).lat == JSON.parse(value.start).lat && JSON.parse(currentValue.end).lon == JSON.parse(value.start).lon)) {
                var keyVal = globalTrafficMap.get(currentkey);
                keyVal.adjacentRoadId.push(key);
                // console.log("***********Road:"+JSON.stringify(keyVal));
                tempGlobalMap.set(currentkey, keyVal);
            } else {
                //road which didn't have any 
                tempGlobalMap.set(currentkey, currentValue);
            }
        }
    }
    console.log("size:" + tempGlobalMap.size);
    return tempGlobalMap;
}

exports.getGloabalTrafficMap = function() {
    return this.TrafficGraphMap;
}

exports.setGloabalTrafficMap = function(TrafficGraphMap) {
    this.TrafficGraphMap = TrafficGraphMap;
}

var populateRoad = function(way) {
    var road = {};
    //globalTrafficMap create
    road.start = JSON.stringify(way.nodeRefs[0]);
    road.end = JSON.stringify(way.nodeRefs[way.nodeRefs.length - 1]);
    road.isOneWay = way.tags.oneway == 'yes' ? true : false;
    road.name = way.tags.name;
    road.lanes = way.tags.lanes;
    road.roadId = way.id;
    road.highway = way.tags.highway;
    road.updatedTime = new Date();
    road.length = calDistance(way.nodeRefs[0].lat, way.nodeRefs[0].lon,
        way.nodeRefs[way.nodeRefs.length - 1].lat,
        way.nodeRefs[way.nodeRefs.length - 1].lon);
    road.adjacentRoadId = [];
    /* 4 - Avg car length (3.5 - 5 meters) - car_length
     *  2.5 - Avg distance between two cars - empty_car_space
     *  capacity(no. of vehicle ocupancy = road_length / (car_lengt * empty_car_space * road_lanes))
     */
    var car_length = process.env.car_length;
    var empty_car_space = process.env.empty_car_space;
    road.capacity = road.length / (car_length * empty_car_space * parseInt((road.lanes != null && road.lanes != undefined) ? road.lanes : "1"));
    /* weight: { type: Number },
     capacity :{ type: Number },
     speed :{ type: Number },
     vehicle_count : { type: Number },
     isCongestion: Boolean,
     color: String,
     adjacentRoadId : [Schema.Types.ObjectId],
     vehicles : [String]*/
    return road;
}

exports.parseOsm = function() {
    //osm parser
    var globalTrafficMap = new Map();
    var nodeMap = new Map();
    var parser = osmread.parse({
        filePath: process.env.mapURI,
        endDocument: function() {
            console.log('document end');
            globalTrafficMap = setAdjacentRoadId(globalTrafficMap);
            exports.setGloabalTrafficMap(globalTrafficMap);
            //store in db
            console.log("************** parsing done");
            for (var [key, value] of globalTrafficMap.entries()) {
                RoadController.createRoad(value).then(function(resp) {
                    console.log("**********response:" + resp);
                    var edge = {};
                    edge.roadId = JSON.parse(resp).roadId;
                    edge.road = mongoose.Types.ObjectId(resp._id);
                    TrafficGraphController.createTrafficMap(edge).then(function(trafficGraphResp) {
                        console.log("**********trafficGraphResp:" + trafficGraphResp);
                    }, function(trafficGraphErr) {
                        console.log("Traffic Graph query Error:" + trafficGraphErr);
                    });
                }, function(err) {
                    console.log("Road Query Error:" + err);
                });
            }
        },
        bounds: function(bounds) {
            console.log('bounds: ' + JSON.stringify(bounds));
        },
        node: function(node) {
            //  console.log('node: ' + JSON.stringify(node));
            nodeMap.set(node.id, node);
        },
        way: function(way) {
            if (way.tags.highway == 'primary' || way.tags.highway == 'secondary') { //
                way.nodeRefs.forEach(function(val, key) {
                    way.nodeRefs[key] = nodeMap.get(val);
                });
                globalTrafficMap.set(way.id, populateRoad(way));

                //TODO: handle both way road id condition  
                /*if (way.tags.oneway != null || way.tags.oneway != undefined) {
                    globalTrafficMap.set(way.id, populateRoad(way, end, start));
                }*/

            }
        },
        relation: function(relation) {
            //  console.log('relation: ' + JSON.stringify(relation));
        },
        error: function(msg) {
            console.log('error: ' + msg);
        }
    });

}
