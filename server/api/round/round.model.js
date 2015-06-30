/*jslint node: true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roundsSchema = new Schema(
    {
        date: Date,
        courseId: Schema.Types.ObjectId,
        playerId: Schema.Types.ObjectId,
        teeId: Schema.Types.ObjectId,
        courseTag: String,
        teeName: String,
        notes: String,
        hdcpIndex: Number,
        grossScore: [Number],
        adjGrossScore: [Number],
        crsHdcp: Number,
        netScore: Number,
        hdcpDiff: Number
    },
    {
        collection: 'rounds'
    }
);

module.exports = mongoose.model('Round', roundsSchema);