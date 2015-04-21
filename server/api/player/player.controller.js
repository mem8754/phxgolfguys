/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /players              ->  index
 * POST    /players              ->  create
 * GET     /players/:id          ->  show
 * PUT     /players/:id          ->  update
 * DELETE  /players/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Player = require('./player.model');

// Get list of players
exports.index = function (req, res) {
    Player.find(req.query, function (err, players) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(players);
    });
};

// Get a single player
exports.show = function (req, res) {
    Player.findById(req.params.id, function (err, player) {
        if (err) { return handleError(res, err); }
        if (!player) { return res.send(404); }
        return res.json(player);
    });
};

// Creates a new player in the DB.
exports.create = function (req, res) {
    Player.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing player in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Player.findById(req.params.id, function (err, player) {
        if (err) { return handleError(res, err); }
        if (!player) { return res.send(404); }
        var updated = _.merge(player, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(player);
        });
    });
};

// Deletes a player from the DB.
exports.destroy = function (req, res) {
    Player.findById(req.params.id, function (err, player) {
        if (err) { return handleError(res, err); }
        if (!player) { return res.send(404); }
        player.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}