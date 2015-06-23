/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /rounds              ->  index
 * POST    /rounds              ->  create
 * GET     /rounds/:id          ->  show
 * PUT     /rounds/:id          ->  update
 * DELETE  /rounds/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var ActiveRound = require('./activeRound.model');

// Get list of rounds
exports.index = function (req, res) {
    ActiveRound.find(req.query, function (err, rounds) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(rounds);
    });
};

// Get a single round
exports.show = function (req, res) {
    ActiveRound.findById(req.params.id, function (err, round) {
        if (err) { return handleError(res, err); }
        if (!round) { return res.send(404); }
        return res.json(round);
    });
};

// Creates a new round in the DB.
exports.create = function (req, res) {
    ActiveRound.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing round in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    ActiveRound.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
    });
};


// Deletes a round from the DB.
exports.destroy = function (req, res) {
    ActiveRound.findById(req.params.id, function (err, round) {
        if (err) { return handleError(res, err); }
        if (!round) { return res.send(404); }
        ActiveRound.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}