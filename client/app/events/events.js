/*jslint node: true, nomen: true */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',
                templateUrl: 'app/events/events.html',
                controller: 'EventsCtrl',
                sp: {
                    authenticate: true
                }
            });
    });