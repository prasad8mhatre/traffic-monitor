'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var TrafficGraphSchema = new Schema({
  roadId : String,    
  road : Schema.Types.ObjectId,

});


TrafficGraphSchema.statics = {

     
    get: function(query, callback) {
        this.findOne(query, callback);
    },
    getAll: function(query, callback) {
        this.find(query, callback);
    },
    updateById: function(id, updateData, callback) {
        this.update(id, {$set: updateData}, callback);
    },
    remove: function(removeData, callback) {
         this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var trafficGraph = new this(data);
        trafficGraph.save(callback);
    }
}

var TrafficGraph = mongoose.model('TrafficGraph', TrafficGraphSchema);

/** export schema */
module.exports = {
    TrafficGraph: TrafficGraph
};