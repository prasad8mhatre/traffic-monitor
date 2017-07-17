const PubNub = require('pubnub');
  
const global_traffic = 'global_traffic' ;
const TrafficGraphController = require('../controllers/TrafficGraphController');  
const trafficManager = require('../managers/trafficManager');
var _this = this;
   
exports.publishMessage = function(pub_message) {
    debugger;
    var publishConfig = {
        channel : global_traffic,
        message : pub_message
    }
    _this.pubnub.publish(publishConfig, function(status, response) {
        console.log("******** Message Published: [" + global_traffic + "]")
        console.log(status, response); 
    })
}
   

exports.init = function () {
	_this.pubnub = new PubNub({
	    publishKey : process.env.pubnub_publishKey,
	    subscribeKey : process.env.pubnub_subscribeKey
	});


	_this.pubnub.addListener({
	    status: function(statusEvent) {
	        if (statusEvent.category === "PNConnectedCategory") {
	            var msg = {code:100, text : 'Global Init Message'}
	            _this.publishMessage(msg);
	        }
	    },
	    message: function(message) {
	        console.log("*******New Message: [" + global_traffic + "]");
	        console.log(message);
	        // add condition for is car
	        if(message.message.code != 100){
	        	_this.updateTraffic(message.message);		
	        } 
	    },
	    presence: function() {
	        // handle presence
	    }
	});

	console.log("Subscribing..");
	_this.pubnub.subscribe({
	    channels: [global_traffic] 
	});

}

exports.updateTraffic = function (message) {
	var trafficUpdate =  TrafficGraphController.createTraffic(message);
    trafficManager.calculateTraffic(trafficUpdate).then(function(result){
        console.log("Pubnub Manager: CalculateTraffic result:" + result);
    }, function(err){
        console.log("Pubnub Manager: CalculateTraffic Error:" + err);
    });
}


