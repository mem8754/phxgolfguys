/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addRound', {
                url: '/addRound/:id',
                templateUrl: 'app/addRound/addRound.html',
                controller: 'AddRoundCtrl',
                sp: {
                    authenticate: true
                }
            });
    });