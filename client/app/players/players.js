/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('players', {
                url: '/players',
                templateUrl: 'app/players/players.html',
                controller: 'PlayersCtrl',
                sp: {
                    authenticate: true
                }

            });
    });