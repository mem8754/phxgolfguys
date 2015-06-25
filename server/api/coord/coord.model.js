/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CoordSchema = new Schema(
    {
        courseId: Schema.Types.ObjectId,
        courseTag: String,
        greenCenter: [{
            latitude: Number,
            longitude: Number,
            altitude: Number,
            accuracy: Number,
            altitudeAccuracy: Number
        }]
    },
    {
        collection: 'coords'
    }
);

module.exports = mongoose.model('Coord', CoordSchema);