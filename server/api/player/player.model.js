/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var playerSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        hdcp: Number,
        ghinNo: String
    },
    {
        collection: 'players'
    }
);

module.exports = mongoose.model('Player', playerSchema);