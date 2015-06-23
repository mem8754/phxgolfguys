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
        coordsUpdated: Boolean,
        teeName: String,
        notes: String,
        grossScore: [Number],
        hcp: [],
        par: [],
        yds: [Number],
        coords: {
            latitude: [ Number ],
            longitude: [ Number ],
            altitude: [ Number ],
            accuracy: [ Number ],
            altitudeAccuracy: [ Number ]
        },
        lat: [],
        lon: []
    },
    {
        collection: 'activeRounds'
    }
);

module.exports = mongoose.model('ActiveRound', activeRoundsSchema);