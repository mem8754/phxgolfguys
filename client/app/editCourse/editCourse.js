/*jslint node: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editCourse', {
                url: '/editCourse/:id',
                templateUrl: 'app/editCourse/editCourse.html',
                controller: 'EditCourseCtrl',
                sp: {
                    authenticate: true
                }
            });
    });