 app.controller('HomeCtrl', [ '$scope', '$state', function($scope, $state) {

    console.log("In Home Ctrl");
    $scope.Hello = "Hello";

    angular.extend($scope, {
	    center: {
	        lat: 21.69826549685252,
	        lng: 79.5849609375,
	        zoom: 8
	    }
	});

 }]);
