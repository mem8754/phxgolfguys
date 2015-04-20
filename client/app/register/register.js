/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: 'app/register/register.html',
                controller: 'RegisterCtrl'
            });
    });