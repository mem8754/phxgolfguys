/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editTeeTime', {
                url: '/editTeeTime/:id',
                templateUrl: 'app/editTeeTime/editTeeTime.html',
                controller: 'EditTeeTimeCtrl',
                sp: {
                    authenticate: true
                }
            });
    });