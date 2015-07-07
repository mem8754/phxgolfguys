/*jslint node: true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activeRoundsSchema = new Schema(
    {
        date: Date,
        courseId: Schema.Types.ObjectId,
        playerId: Schema.Types.ObjectId,
        teeId: Schema.Types.ObjectId,
        courseTag: String,
        teeName: String,
        grossScore: [Number],
        hcp: [],
        par: [],
        yds: [Number],
        greenCenter: [{
            latitude: Number,
            longitude: Number
        }],
        greenFront: [{
            latitude: Number,
            longitude: Number
        }],
        greenBack: [{
            latitude: Number,
            longitude: Number
        }],
        hazards: [
            {
                name: [String],
                reach: [{
                    latitude: Number,
                    longitude: Number
                }],
                carry: [{
                    latitude: Number,
                    longitude: Number
                }]
            }
        ]
    },
    {
        collection: 'activeRounds'
    }
);

module.exports = mongoose.model('ActiveRound', activeRoundsSchema);