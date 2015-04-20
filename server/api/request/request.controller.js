/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /requests              ->  index
 * POST    /requests              ->  create
 * GET     /requests/:id          ->  show
 * PUT     /requests/:id          ->  update
 * DELETE  /requests/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Player = require('./request.model');

// Get list of requests
exports.index = function (req, res) {
    Player.find(req.query, function (err, requests) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(requests);
    });
};

// Get a single request
exports.show = function (req, res) {
    Player.findById(req.params.id, function (err, request) {
        if (err) { return handleError(res, err); }
        if (!request) { return res.send(404); }
        return res.json(request);
    });
};

// Creates a new request in the DB.
exports.create = function (req, res) {
    Player.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing request in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Player.findById(req.params.id, function (err, request) {
        if (err) { return handleError(res, err); }
        if (!request) { return res.send(404); }
        var updated = _.merge(request, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(request);
        });
    });
};

// Deletes a request from the DB.
exports.destroy = function (req, res) {
    Player.findById(req.params.id, function (err, request) {
        if (err) { return handleError(res, err); }
        if (!request) { return res.send(404); }
        request.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}