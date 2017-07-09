'use strict';

/**
 * @ngdoc function
 * @name traffic-monitor.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the traffic-monitor
 */
app.controller('MainCtrl', ['$scope', '$state', '$http', 'ApiService', function($scope, $state, $http, ApiService) {

    console.log("In Main Ctrl");
    $scope.Hello = "Hello";

    // Path
    angular.extend($scope, {
        center: {
            lat: 21.69826549685252,
            lng: 79.5849609375,
            zoom: 4
        },legend: {
            position: 'bottomright',
            colors: [ 'RED', 'ORANGE', 'GREEN', 'GRAY' ],
            labels: [ 'Heavy Traffic', 'Moderate Traffic', 'Free Flow Traffic', 'No Traffic Data Available' ]
        },
    });



    var getColor = function(densityColor) {
        
        if (densityColor == 'RED') {
            return 'red';
        } else if (densityColor == 'GREEN') {
            return 'green';
        } else if (densityColor == 'ORANGE') {
            return 'orange';
        } else {
            return 'grey';
        }

    };

    var getStyle = function(feature) {
        return {
            fillColor: 'white',
            weight: 8,
            opacity: 1,
            color: getColor(feature.color),
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    var createGeoJsonObject = function(data) {
        return {
            data: data,
            style: getStyle
        };
    };

    

    $scope.updateMap = function() {

        // Get the traffic data geojson data from a JSON green
        $http.get('/traffic/getGreenTraffic').success(function(data, status) {
            
            if (!$scope.geojson || angular.isUndefined($scope.geojson)) {
                $scope.geojson = createGeoJsonObject(data);
            }
        });

        // Get the traffic data geojson data from a JSON orange
        $http.get('/traffic/getOrangeTraffic').success(function(data, status) {
            
            if (!$scope.geojson || angular.isUndefined($scope.geojson)) {
                $scope.geojson = createGeoJsonObject(data);
            } else {
                bindTrafficData(data);
            }
        });


         // Get the traffic data geojson data from a JSON red
        $http.get('/traffic/getRedTraffic').success(function(data, status) {

            if (!$scope.geojson || angular.isUndefined($scope.geojson)) {
                $scope.geojson = createGeoJsonObject(data);
            } else {
                bindTrafficData(data);
            }
        });

    }

    $scope.sendMockLocation = function(lat, lng){
        
        ApiService.getRoadId(lat, lng).then(function(resp){
            //var data = JSON.parse(resp.data);
            var data = resp.data;
            if(data.osm_type == 'way'){
                var req = {
                 method: 'POST',
                 url: '/traffic/locationUpdate',
                 data: {
                        'speed':14,
                        'uuid':123,
                        'edgeId': data.osm_id,
                        'isMock': true 

                    }
                }

                $http(req).then(function(data, status){
                    console.log("location update sent!");
                    $scope.updateMap();   
                    debugger;
                }, function(data, status){
                    console.log("Error while sending location update!");  
                });
            }else{
                console.log("No Wayid found for given lat long.")
            }
        }, function(err){
            console.log(err);
        });
        
        
    }




    var bindTrafficData = function(x) {
        var features = $scope.geojson.data.features.concat(x.features);
        var copy = angular.extend({}, $scope.geojson.data);
        copy.features = features;
        $scope.geojson.data = copy;
    }

    $scope.updateMap();


}]);


app.service('ApiService', ['$http', 'locationIQ', '$q', function($http, locationIQ, $q){
   this.getRoadId = function (lat, long) {
        return $q(function(resolve, reject) {
          setTimeout(function() {
              resolve({"data":{"place_id":"128321428","licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright","osm_type":"way","osm_id":"250162145","lat":"18.5645653","lon":"73.7750516","display_name":"Baner Road, Pimple Nilakh, Mhalunge, Pune, Maharashtra, 411045, India","address":{"road":"Baner Road","suburb":"Pimple Nilakh","village":"Mhalunge","county":"Pune","state_district":"Pune","state":"Maharashtra","postcode":"411045","country":"India","country_code":"in"},"boundingbox":["18.5623192","18.5686997","73.7666714","73.7839222"]},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"url":"http://locationiq.org/v1/reverse.php?format=json&key=e9fbe60b2244e1a62302&lat=18.5664275&lon=73.7702451&addressdetails=1","headers":{"Accept":"application/json, text/plain, */*"}},"statusText":"OK"});
          }, 1000);
        }); 

         /*return $http({
            method: 'GET',
            url: '/traffic/getRoadId',
            params: {'lat': lat, 'long': long}
        });*/
      }
}]);