'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var VehicleSchema = new Schema({
  vehicleId : String,
  password: String, 
  isActive : Boolean

});


VehicleSchema.statics = {


    get: function(query, callback) {
        this.find(query, callback);
    },
    getAll: function(query, callback) {
        this.find(query, callback);
    },
    updateById: function(vehicleId, updateData, callback) {
        this.update({vehicleId: vehicleId}, {$set: updateData}, callback);
    },
    remove: function(removeData, callback) {
         this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var vehicle = new this(data);
        vehicle.save(callback);
    }
}

var Vehicle = mongoose.model('Vehicle', VehicleSchema);

/** export schema */
module.exports = {
    Vehicle: Vehicle
};
