const PubNub = require('pubnub');
   
var pubnub = new PubNub({
    publishKey : process.env.pubnub_publishKey,
    subscribeKey : process.env.pubnub_subscribeKey
});
   
exports.publishSampleMessage = function() {
    console.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
    var publishConfig = {
        channel : "hello_world",
        message : "Hello from PubNub Docs!"
    }
    pubnub.publish(publishConfig, function(status, response) {
        console.log(status, response);
    })
}
   
pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            publishSampleMessage();
        }
    },
    message: function(message) {
        console.log("New Message!!", message);
    },
    presence: function() {
        // handle presence
    }
});

console.log("Subscribing..");
pubnub.subscribe({
    channels: ['hello_world'] 
});
