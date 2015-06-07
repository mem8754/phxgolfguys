/*global angular */

(function () {
    'use strict';
    var CoursesCtrl = function ($scope, $log, coursesFactory) {
        $scope.cSortBy = 'name';
        $scope.cReverse = false;
        $scope.courses = [];
        
        function init() {
            if (undefined === $rootscope.userAuth) {
                
            coursesFactory.getCourses()
                .success(function (courses) {
                    $scope.courses = courses;
                })
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting Courses: ', status);
                    $log.warn('Data: ' + data);
                });
        }
        
        init();
        
        $scope.doSort = function (propName) {
            if (propName === $scope.cSortBy) {
                $scope.cReverse = !$scope.cReverse;
            } else {
                $scope.cReverse = false;
                $scope.cSortBy = propName;
            }
        };
    };
    
    CoursesCtrl.$inject = ['$scope', '$log', 'coursesFactory'];

    angular.module('phoenixGolfGuysApp')
        .controller('CoursesCtrl', CoursesCtrl);
    
}());