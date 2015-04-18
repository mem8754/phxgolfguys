/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('viewCourse', {
                url: '/viewCourse/:id',
                templateUrl: 'app/viewCourse/viewCourse.html',
                controller: 'ViewCourseCtrl',
                sp: {
                    authenticate: true
                }
            });
    });