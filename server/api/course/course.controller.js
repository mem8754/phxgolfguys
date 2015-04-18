/*jslint node: true, nomen: true  */
/*global handleError  */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /courses              ->  index
 * POST    /courses              ->  create
 * GET     /courses/:id          ->  show
 * PUT     /courses/:id          ->  update
 * DELETE  /courses/:id          ->  destroy
 *
 * GET     /courses/by/tag/:tag  ->  findByTag
 */

'use strict';

var _ = require('lodash');
var Course = require('./course.model');

// Get list of courses
exports.index = function (req, res) {
    Course.find(function (err, courses) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(courses);
    });
};

// Get courses by Course Tag
exports.findByTag = function (req, res) {
    Course.find({ tag : req.params.tag }, function (err, courses) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(courses);
    });
};

// Get a single course
exports.show = function (req, res) {
    Course.findById(req.params.id, function (err, course) {
        if (err) { return handleError(res, err); }
        if (!course) { return res.send(404); }
        return res.json(course);
    });
};

// Creates a new course in the DB.
exports.create = function (req, res) {
    Course.create(req.body, function (err, thing) {
        if (err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing course in the DB.
exports.update = function (req, res) {
    if (req.body._id) { delete req.body._id; }
    Course.findByIdAndUpdate(req.params.id, req.body, function (err, updated) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
    });
};

// Deletes a course from the DB.
exports.destroy = function (req, res) {
    Course.findById(req.params.id, function (err, course) {
        if (err) { return handleError(res, err); }
        if (!course) { return res.send(404); }
        course.remove(function (err) {
            if (err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}