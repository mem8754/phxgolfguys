/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addTeeTime', {
                url: '/addTeeTime',
                templateUrl: 'app/addTeeTime/addTeeTime.html',
                controller: 'AddTeeTimeCtrl',
                sp: {
                    authenticate: true
                }
            });
    });