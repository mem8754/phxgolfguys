/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /tees              ->  index
 * POST    /tees              ->  create
 * GET     /tees/:id          ->  show
 * PUT     /tees/:id          ->  update
 * DELETE  /tees/:id          ->  destroy
 *
 * And some custom methods for special requests:
 * GET     /tees/by/default     ->  default
 * GET     /tees/by/course/:id  ->  findByCourse
 */

'use strict';

var _ = require('lodash');
var Tee = require('./tee.model');

// Get list of tees
exports.index = function (req, res) {
    console.log("Query: ", req.query);
    Tee.find(req.query, function (err, tees) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(tees);
    });
};

// Get a single tee
exports.show = function (req, res) {
    Tee.findById(req.params.id, function (err, tee) {
        if (err) { return handleError(res, err); }
        if (!tee) { return res.send(404); }
        return res.json(tee);
    });
};

// Creates a new tee in the DB.
exports.create = function (req, res) {
    Tee.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing tee in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Tee.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
    });
};


// Deletes a tee from the DB.
exports.destroy = function (req, res) {
    Tee.findById(req.params.id, function (err, tee) {
        if (err) { return handleError(res, err); }
        if (!tee) { return res.send(404); }
        tee.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}