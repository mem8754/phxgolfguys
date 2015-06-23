/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addActiveRound', {
                url: '/addActiveRound/:id',
                templateUrl: 'app/addActiveRound/addActiveRound.html',
                controller: 'AddActiveRoundCtrl',
                sp: {
                    authenticate: true
                }
            });
    });