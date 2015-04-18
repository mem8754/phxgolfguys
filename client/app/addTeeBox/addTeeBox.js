/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addTeeBox', {
                url: '/addTeeBox/:id',
                templateUrl: 'app/addTeeBox/addTeeBox.html',
                controller: 'AddTeeBoxCtrl',
                sp: {
                    authenticate: true
                }
            });
    });