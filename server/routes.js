/**
 * Main application routes
 */

/*jslint node: true, nomen: true  */
/*global angular */

'use strict';
var stormpathExpressSdk = require('stormpath-sdk-express'),
    errors = require('./components/errors'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var spMiddleware = stormpathExpressSdk.createMiddleware();

module.exports = function (app) {

    spMiddleware.attachDefaults(app);
    
// get all data/stuff of the body (POST) parameters
// parse application/json 
    app.use(bodyParser.json());

// parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

// parse cookies with cookie-parser and cookieSecret
//    app.use(cookieParser(credentials.cookieSecret));
    
    app.use('/api/things', spMiddleware.authenticate, require('./api/thing'));
    app.use('/api/courses', spMiddleware.authenticate, require('./api/course'));
    app.use('/api/players', require('./api/player')); // no auth
    app.use('/api/events', spMiddleware.authenticate, require('./api/event'));
    app.use('/api/teeTimes', spMiddleware.authenticate, require('./api/teeTime'));
    app.use('/api/tees', spMiddleware.authenticate, require('./api/tee'));
    app.use('/api/rounds', spMiddleware.authenticate, require('./api/round'));
    app.use('/api/requests', require('./api/request')); // no auth

// , spMiddleware.authenticate
    
// All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

// All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
