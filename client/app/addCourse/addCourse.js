/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addCourse', {
                url: '/addCourse',
                templateUrl: 'app/addCourse/addCourse.html',
                controller: 'AddCourseController',
                sp: {
                    authenticate: true
                }
            });
    });