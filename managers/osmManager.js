const osmread = require('osm-read');

const TrafficGraphController = require('../controllers/TrafficGraphController');
const RoadController = require('../controllers/RoadController');

var Road = require('../models/Road').Road;
const TrafficGraph = require('../models/TrafficGraph');

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


var calDistance = function(lat1, lon1, lat2, lon2){
  var R = 6371e3; // metres
  var φ1 = lat1.toRad();
  var φ2 = lat2.toRad();
  var Δφ = (lat2-lat1).toRad();
  var Δλ = (lon2-lon1).toRad();

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  //in meters 
  return R * c;
}


exports.parseOsm = function() {
    //osm parser
    var globalTrafficMap = new Map();
    var nodeMap = new Map();
    var parser = osmread.parse({
        filePath: process.env.mapURI,
        endDocument: function() {
            console.log('document end');
        },
        bounds: function(bounds) {
            console.log('bounds: ' + JSON.stringify(bounds));
        },
        node: function(node) {
            //  console.log('node: ' + JSON.stringify(node));
            nodeMap.set(node.id, node);
        },
        way: function(way) {
            if (way.tags.highway == 'primary' || way.tags.highway == 'secondary') {
                console.log(way.tags.name + "****************************************************");
                var road = {};  
                way.nodeRefs.forEach(function(val, key) {
                    way.nodeRefs[key] = nodeMap.get(val);
                    console.log(way.nodeRefs[key].lat + " ," + way.nodeRefs[key].lon);
                });
                console.log('Way: ' + JSON.stringify(way));
                
                //TODO: globalTrafficMap create
                road.start = JSON.stringify(way.nodeRefs[0]);
                road.end = JSON.stringify(way.nodeRefs[way.nodeRefs.length-1]);
                road.isOneWay = way.tags.oneway == 'yes' ? true : false;
                road.name = way.tags.name;
                road.lanes = parseInt(way.tags.lanes);
                road.roadId = way.id;
                road.highway = way.tags.highway;
                road.updatedTime = new Date();
                road.length = calDistance(way.nodeRefs[0].lat, way.nodeRefs[0].lon, 
                                    way.nodeRefs[way.nodeRefs.length-1].lat, 
                                    way.nodeRefs[way.nodeRefs.length-1].lon ),
               /* weight: { type: Number },
                capacity :{ type: Number },
                speed :{ type: Number },
                vehicle_count : { type: Number },
                isCongestion: Boolean,
                color: String,
                adjacentRoadId : [Schema.Types.ObjectId],
                vehicles : [String]*/
                globalTrafficMap.set(way.id, road);
                //TODO: store in db  
                console.log("********** create road " + RoadController.createRoad);



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
