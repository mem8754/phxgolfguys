/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /teeTimes              ->  index
 * POST    /teeTimes              ->  create
 * GET     /teeTimes/:id          ->  show
 * PUT     /teeTimes/:id          ->  update
 * DELETE  /teeTimes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var TeeTime = require('./teeTime.model');

// Get list of teeTimes
exports.index = function (req, res) {
    
    var currTime = new Date(),
        refTime = currTime.toISOString();       /* capture current time in ISO format string  */
    
    req.query.eventType = "Tee Time";           /* query for "Tee Time" events only.  */
    
    if (req.query && req.query.future) {        /* convert request for future or past events to a date criteria  */
        req.query.dateTime = { '$gt' : refTime };
        delete req.query.future;
    } else {
        if (req.query && req.query.past) {
            req.query.dateTime = { '$lt' : refTime };
            delete req.query.past;
        }
    }
        
    TeeTime.find(req.query, function (err, teeTimes) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(teeTimes);
    });
};

// Get a single teeTime
exports.show = function (req, res) {
    TeeTime.findById(req.params.id, function (err, teeTime) {
        if (err) { return handleError(res, err); }
        if (!teeTime) { return res.send(404); }
        return res.json(teeTime);
    });
};

// Creates a new teeTime in the DB.
exports.create = function (req, res) {
    TeeTime.create(req.body, function (err, teeTime) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(teeTime);
    });
};

// Updates an existing teeTime in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    TeeTime.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
    });
};

// Deletes a teeTime from the DB.
exports.destroy = function (req, res) {
    TeeTime.findById(req.params.id, function (err, teeTime) {
        if (err) { return handleError(res, err); }
        if (!teeTime) { return res.send(404); }
        teeTime.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}