/*jslint node: true, nomen: true  */
/*global angular  */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teesSchema = new Schema(
    {
        teeName: String,
        courseId: Schema.Types.ObjectId,
        rating: Number,
        slope: Number,
        yds: [Number]
    },
    {
        collection: 'tees'
    }
);

module.exports = mongoose.model('Tee', teesSchema);