/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /events              ->  index
 * POST    /events              ->  create
 * GET     /events/:id          ->  show
 * PUT     /events/:id          ->  update
 * DELETE  /events/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Event = require('./event.model');

// Get list of events
exports.index = function (req, res) {
    if (req.query && req.query.future) {        /* convert request for future events to a date criteria  */
        var currTime = new Date(),
            refTime = currTime.toISOString();
        req.query.dateTime = { '$gt' : refTime };
        delete req.query.future;
    }
    Event.find(req.query, function (err, events) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(events);
    });
};

// Get a single event
exports.show = function (req, res) {
    Event.findById(req.params.id, function (err, event) {
        if (err) { return handleError(res, err); }
        if (!event) { return res.send(404); }
        return res.json(event);
    });
};

// Creates a new event in the DB.
exports.create = function (req, res) {
    Event.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing event in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Event.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
    });
};

// Deletes a event from the DB.
exports.destroy = function (req, res) {
    Event.findById(req.params.id, function (err, event) {
        if (err) { return handleError(res, err); }
        if (!event) { return res.send(404); }
        event.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}