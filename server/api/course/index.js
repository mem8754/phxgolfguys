/*jslint node: true  */

'use strict';

var express = require('express');
var controller = require('./course.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/by/tag/:tag', controller.findByTag);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;