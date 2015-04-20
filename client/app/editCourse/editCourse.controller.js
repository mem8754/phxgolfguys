/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EditCourseCtrl', function ($scope, $state, $stateParams, $window, $log, coursesFactory) {
        var courseId = $stateParams.id;
        $scope.course = null;
        
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error ' + status + ' retrieving Course data.');
                })
                .success(function (course) {
                    $scope.course = course;
                });
        }
        
        init();
        
        $scope.updateCourse = function () {
            coursesFactory.updateCourse($scope.course)
                .error(function (data, status, headers, config) {
                    $window.alert("\nServer error updating course in database.\n");
                })
                .success(function (data) {
                    $window.alert("\nCourse successfully updated.\n");
                    $state.go('viewCourse', { id: $scope.course._id });
                });
        };
    });