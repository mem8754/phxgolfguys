/*jslint node: true  */

'use strict';

var express = require('express');
var controller = require('./coord.controller');
var router = express.Router();

router.get('/', controller.index);
router.get('/by/course/:courseId', controller.findByCourse);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;