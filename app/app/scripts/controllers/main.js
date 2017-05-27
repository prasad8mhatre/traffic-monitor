'use strict';

/**
 * @ngdoc function
 * @name kanbanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kanbanApp
 */
 app.controller('MainCtrl', [ '$scope', '$state', '$http', function($scope, $state, $http) {

    console.log("In Main Ctrl");
    $scope.Hello = "Hello";

    /* Path
    angular.extend($scope, {
	    center: {
	        lat: 21.69826549685252,
	        lng: 79.5849609375,
	        zoom: 4
	    },
        paths: {
            p1: {
                color: '#008000',
                weight: 3   ,
                latlngs: [
                    { lat: 18.5672913 , lng: 73.8115378 },
                    { lat: 18.5685199, lng: 73.8114518 },
                    { lat: 18.5622281, lng: 73.7840667 },
                    { lat: 18.5621983, lng: 73.7840871 }
                   
                ],
            },p2: {
                color: 'red',
                weight: 3,
                latlngs: [
                    { lat: 18.5621623 , lng: 73.7841117},
                    { lat: 18.5620815, lng: 73.7841822 }
                    
                    
                ],
            }
        },
	});
*/


     var getColor = function(densityColor){
        if(densityColor == 'RED'){
            return 'red';
        }else if(densityColor == 'GREEN'){
            return 'green';
        }else if(densityColor == 'ORANGE'){
            return 'orange';
        }else{
            return 'grey';
        }
            
    };

    var getStyle = function(feature){
        return {
            fillColor: 'white',
            weight: 8,
            opacity: 1,
            color: getColor(feature.id),
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    var createGeoJsonObject = function (data){
        return {
            data: data,
            style: getStyle
        };
    };
 
	debugger;

    $scope.updateMap = function(){
        // Get the traffic data geojson data from a JSON red
    $http.get('/traffic/trafficGraph/getRedTraffic').success(function(data, status) {
        debugger;

        if(!$scope.geojson){
            $scope.geojson = createGeoJsonObject(data);
        }
       /* angular.extend($scope, {
            geojson: {
                data: data,
                style: 
            }
        });*/
    });


    // Get the traffic data geojson data from a JSON green
    $http.get('/traffic/trafficGraph/getGreenTraffic').success(function(data, status) {
        debugger;

        var x = {
            "type": "FeatureCollection",
            "features": [{
              "type": "Feature",
              "id": "way/217112801",
              "properties": {
                "timestamp": "2013-08-08T08:19:57Z",
                "version": "3",
                "changeset": "17263382",
                "user": "singleton",
                "uid": "1157969",
                "highway": "primary",
                "name": "University Road",
                "id": "way/217112808"
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                   73.8138811,18.5616884 
                  ],
                  [
                   73.8122429,18.5654896 
                  ]
                ]
              }
            }

            ]
            };
            var features = $scope.geojson.data.features.concat(x.features);
            var copy = angular.extend({}, $scope.geojson.data);
            copy.features = features;
             $scope.geojson.data = copy;

       /* angular.extend($scope, {
            geojson: {
                data: copy,
                style: {
                    fillColor: "green",
                    weight: 8,
                    opacity: 1,
                    color: 'green',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        });*/
       /* angular.extend($scope, {
            geojson: {
                data: data,
                style: 
            }
        });*/
    });

    // Get the traffic data geojson data from a JSON grey
    $http.get('/traffic/trafficGraph/getOrangeTraffic').success(function(data, status) {
        debugger;

        var x = {
"type": "FeatureCollection",
"features": [{
              "type": "Feature",
              "id": "way/217112801",
              "properties": {
                "timestamp": "2013-08-08T08:19:57Z",
                "version": "3",
                "changeset": "17263382",
                "user": "singleton",
                "uid": "1157969",
                "highway": "primary",
                "name": "University Road",
                "id": "way/217112808"
              },
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [
                   73.8138811,18.5616884 
                  ],
                  [
                   73.8122429,18.5654896 
                  ]
                ]
              }
            }

            ]
            };
            var features = $scope.geojson.data.features.concat(x.features);
            var copy = angular.extend({}, $scope.geojson.data);
            copy.features = features;
             $scope.geojson.data = copy;

       /* angular.extend($scope, {
            geojson: {
                data: copy,
                style: {
                    fillColor: "green",
                    weight: 8,
                    opacity: 1,
                    color: 'green',
                    dashArray: '3',
                    fillOpacity: 0.7
                }
            }
        });*/
       /* angular.extend($scope, {
            geojson: {
                data: data,
                style: 
            }
        });*/
    });

    }

    $scope.updateMap();
	

 }]);
