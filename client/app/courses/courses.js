/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('courses', {
                url: '/courses',
                templateUrl: 'app/courses/courses.html',
                controller: 'CoursesCtrl',
                sp: {
                    authenticate: true
                }

            });
    });