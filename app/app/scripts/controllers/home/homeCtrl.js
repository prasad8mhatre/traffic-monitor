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

 app.controller('CertificateCtrl', [ '$scope', '$state', 'ApiService', function($scope, $state, ApiService) {

    console.log("In Certificate Ctrl");
    $scope.vehicles = [];
    ApiService.getAllVehicles().then(function(resp){
    	$scope.vehicles = resp.data;
    });

    $scope.updateVehicle = function(action, vehicle){
    	
    	if(action == 'revoke'){
    		vehicle.isActive = false;
    	}else{
    		vehicle.isActive = true;
    	}
    	ApiService.updateVehicle(vehicle).then(function(resp){
    		console.log("Vehicle status updated");
    	});
    }
    

 }]);

