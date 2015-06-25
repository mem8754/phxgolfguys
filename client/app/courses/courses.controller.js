/*jslint node: true, nomen: true */
/*global angular */

(function () {
    'use strict';
    var CoursesCtrl = function ($scope, $rootScope, $state, $log, $window, coursesFactory, playersFactory) {
        $scope.cSortBy = 'tag';
        $scope.cReverse = false;
        $scope.courses = [];
        
        function init() {
                
// User authorization not required to view the courses.
            
            if (!$rootScope.userAuthorized) {
                $window.alert('\nUser is not authorized to access this web site. (01.02)');
                $state.go("main");
            } else {
                coursesFactory.getCourses()
                    .success(function (courses) {
                        $scope.courses = courses;
                    })
                    .error(function (data, status, headers, config) {
                        $log.warn('Server error getting Courses: ', status);
                    });
            }
        }
        
        function authenticateUser() {

    // Authorize this user if logged in email is found in Players.
            playersFactory.getPlayerByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $log.log("Error querying for authorization (Courses).");
                })
                .success(function (player) {
                    $rootScope.userAuthenticated = true;
                    if (player.length === 1) {
                        $rootScope.userAuthorized = true;
                        $rootScope.playerId = player[0]._id;
                        init();
                    } else {
                        $window.alert("\nUser is not authorized to access this web site. (01.01)\n.");
                        $state.go("main");
                    }
                });
        }

        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request user authentication with factory.
        } else {
            init();
        }
        
        $scope.doSort = function (propName) {
            if (propName === $scope.cSortBy) {
                $scope.cReverse = !$scope.cReverse;
            } else {
                $scope.cReverse = false;
                $scope.cSortBy = propName;
            }
        };
    };
    
    CoursesCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'coursesFactory', 'playersFactory'];

    angular.module('phoenixGolfGuysApp')
        .controller('CoursesCtrl', CoursesCtrl);
    
}());