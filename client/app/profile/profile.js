/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/profile/profile.html',
                controller: 'ProfileCtrl',
                sp: {
                    authenticate: true
                }
            });
    });