'use strict';

/**
 * @ngdoc function
 * @name traffic-monitor.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the traffic-monitor
 */
app.controller('MainCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {

    console.log("In Main Ctrl");
    $scope.Hello = "Hello";
    debugger;

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
        debugger;
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

    debugger;

    $scope.updateMap = function() {

        // Get the traffic data geojson data from a JSON green
        $http.get('/traffic/getGreenTraffic').success(function(data, status) {
            debugger;
            if (!$scope.geojson || angular.isUndefined($scope.geojson)) {
                $scope.geojson = createGeoJsonObject(data);
            }
        });

        // Get the traffic data geojson data from a JSON orange
        $http.get('/traffic/getOrangeTraffic').success(function(data, status) {
            debugger;
            if (!$scope.geojson || angular.isUndefined($scope.geojson)) {
                $scope.geojson = createGeoJsonObject(data);
            } else {
                bindTrafficData(data);
            }
        });


         // Get the traffic data geojson data from a JSON red
        $http.get('/traffic/getRedTraffic').success(function(data, status) {
            debugger;

            if (!$scope.geojson || angular.isUndefined($scope.geojson)) {
                $scope.geojson = createGeoJsonObject(data);
            } else {
                bindTrafficData(data);
            }
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
