'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var RoadSchema = new Schema({
  roadId : String,
  name: String,
  start: String,
  end: String,
  length: { type: Number },
  weight: { type: Number },
  capacity : SchemaTypes.Double,
  speed :{ type: Number },
  vehicle_count : { type: Number },
  isCongestion: Boolean,
  color: String,
  isOneWay : Boolean,
  lanes : String,
  updatedTime :  Date,
  highway: String,
  adjacentRoadId : [String],
  vehicles : [String]

});


RoadSchema.statics = {


    get: function(query, callback) {
        this.findOne(query, callback);
    },
    getAll: function(query, callback) {
        this.find(query, callback);
    },
    updateById: function(roadId, updateData, callback) {
        this.update(roadId, {$set: updateData}, callback);
    },
    remove: function(removeData, callback) {
         this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var road = new this(data);
        road.save(callback);
    }
}

var Road = mongoose.model('Road', RoadSchema);

/** export schema */
module.exports = {
    Road: Road
};
