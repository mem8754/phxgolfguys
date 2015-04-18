/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('viewPlayer', {
                url: '/viewPlayer/:id',
                templateUrl: 'app/viewPlayer/viewPlayer.html',
                controller: 'ViewPlayerCtrl',
                sp: {
                    authenticate: true
                }
            });
    });