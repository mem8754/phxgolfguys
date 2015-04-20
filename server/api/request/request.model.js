/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var requestSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        hdcp: Number,
        ghinNo: String,
    },
    {
        collection: 'requests'
    }
);

module.exports = mongoose.model('Request', requestSchema);