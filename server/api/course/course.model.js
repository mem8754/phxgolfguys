/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourseSchema = new Schema(
    {
        tag: String,
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
        web: String,
        hcp: [],
        par: [],
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
        collection: 'courses'
    }
);

module.exports = mongoose.model('Course', CourseSchema);