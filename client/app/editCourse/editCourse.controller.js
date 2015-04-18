/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EditCourseCtrl', function ($scope, $state, $stateParams, $window, $log, coursesFactory, roundsFactory) {
        var courseId = $stateParams.id;
        $scope.course = null;
        
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting Course data: ', status);
                    $log.warn('Data: ' + data);
                })
                .success(function (course) {
                    $scope.course = course;
                });
        }
        
        init();
        
        $scope.updateCourse = function () {
            coursesFactory.updateCourse($scope.course)
                .error(function (data, status, headers, config) {
                    $log.warn('Error updating Course: ', status);
                    $log.warn("Data: ", data);
                    $window.alert("Server error updating course in database.");
                })
                .success(function (data) {
                    $window.alert("Course successfully updated.");
                    $state.go('viewCourse', { id: $scope.course._id });
                });
        };
    });