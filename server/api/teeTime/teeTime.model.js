/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teeTimeSchema = new Schema(
    {
        eventType: String,
        dateTime: Date,
        courseId: Schema.Types.ObjectId,
        players: [ Schema.Types.ObjectId ],
        fees: Number,
        notes: String
    },
    {
        collection: 'events'
    }
);

module.exports = mongoose.model('TeeTime', teeTimeSchema);