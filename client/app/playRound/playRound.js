/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('playRound', {
                url: '/playRound/:id',
                templateUrl: 'app/playRound/playRound.html',
                controller: 'PlayRoundCtrl',
                sp: {
                    authenticate: false
                }
            });
    });