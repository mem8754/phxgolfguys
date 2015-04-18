/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editTeeBox', {
                url: '/editTeeBox/:id',
                templateUrl: 'app/editTeeBox/editTeeBox.html',
                controller: 'EditTeeBoxCtrl',
                sp: {
                    authenticate: true
                }
            });
    });