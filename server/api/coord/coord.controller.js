/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /coords                          ->  index
 * POST    /coords                          ->  create
 * GET     /coords/:id                      ->  show
 * PUT     /coords/:id                      ->  update
 * DELETE  /coords/:id                      ->  destroy
 *
 * GET     /coords/by/course/:courseId      ->  findByCourse
 */

'use strict';

var _ = require('lodash');
var Coord = require('./coord.model');

// Get list of coords
exports.index = function (req, res) {
    Coord.find(function (err, coords) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(coords);
    });
};

// Get coords by Course ID
exports.findByCourse = function (req, res) {
    Coord.find({ courseId : req.params.courseId }, function (err, coords) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(coords);
    });
};

// Get a single entry from coords by _id
exports.show = function (req, res) {
    Coord.findById(req.params.id, function (err, coords) {
        if (err) { return handleError(res, err); }
        if (!coords) { return res.send(404); }
        return res.json(coords);
    });
};

// Creates a new coords document in the DB.
exports.create = function (req, res) {
    Coord.create(req.body, function (err, data) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(data);
    });
};

// Updates an existing document in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Coord.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
    });
};

// Deletes a document from the DB.
exports.destroy = function (req, res) {
    Coord.findById(req.params.id, function (err, coords) {
        if (err) { return handleError(res, err); }
        if (!coords) { return res.send(404); }
        coords.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}