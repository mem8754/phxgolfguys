/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editRound', {
                url: '/editRound/:id',
                templateUrl: 'app/editRound/editRound.html',
                controller: 'EditRoundCtrl',
                sp: {
                    authenticate: true
                }
            });
    });