/*jslint nomen: true, node: true, plusplus: true */
/*global angular*/

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EventsCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $window, $log, eventsFactory, coursesFactory, playersFactory) {

        $scope.scheduledTeeTimes = null;
        $scope.pastTeeTimes = null;
        $scope.courseNames = null;
        $scope.futureEventsFound = false;
        $scope.pastEventsFound = false;

        function init() {
            
// Begin by getting the future Tee Times from the database.
            if (!$rootScope.userAuthorized) {
                $window.alert("\nUser is not authorized to access this web site.\n");
                $state.go("main");
                return;
            }
            
            eventsFactory.getFutureTeeTimes()
                .error(function (data, status, headers, config) {
                    $log.log('Error getting scheduled Tee Times: ', status);
                })
                .success(function (futureTT) {
                    $scope.scheduledTeeTimes = futureTT;
                    if (futureTT.length > 0) {
                        $scope.futureEventsFound = true;
                    }
                
// If successful, read the past Tee Times from the database.
                
                    eventsFactory.getPastTeeTimes()
                        .error(function (data, status, headers, config) {
                            $log.log('Error getting past Tee Times: ', status);
                        })
                        .success(function (pastTT) {
                            $scope.pastTeeTimes = pastTT;
                            if (pastTT.length > 0) {
                                $scope.pastEventsFound = true;
                            }

// If successful, read the course tags (and _id's) from the database.
                        
                            coursesFactory.getCourseNames()
                                .error(function (data, status, headers, config) {
                                    $log.log('Server error getting course names.');
                                })
                                .success(function (courseNames) {
                                    var i = 0,
                                        j = 0;
                                
                                    $scope.courseNames = courseNames;

// Iterate through the future Tee Times to insert the course name into the Tee Time object, based on a match of the course ID.
                                        
                                    for (i = 0; i < $scope.scheduledTeeTimes.length; i++) {
                                        for (j = 0; j < $scope.courseNames.length; j++) {
                                            if ($scope.scheduledTeeTimes[i].courseId === $scope.courseNames[j]._id) {
                                                $scope.scheduledTeeTimes[i].courseTag = $scope.courseNames[j].tag;
                                                break;
                                            }
                                        }
                                    }
                                        
// Iterate through the past Tee Times to insert the course names, as done above for future Tee Times.

                                    for (i = 0; i < $scope.pastTeeTimes.length; i++) {
                                        for (j = 0; j < $scope.courseNames.length; j++) {
                                            if ($scope.pastTeeTimes[i].courseId === $scope.courseNames[j]._id) {
                                                $scope.pastTeeTimes[i].courseTag = $scope.courseNames[j].tag;
                                                break;
                                            }
                                        }
                                    }
                                });
                        });
                });
 
        }
    
        function authenticateUser() {

    // Authorize this user if logged in email is found in Players.
            
            playersFactory.getPlayerByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $log.log("Error querying for authorization (Events).");
                })
                .success(function (player) {
                    $rootScope.userAuthenticated = true;
                    if (player.length === 1) {
                        $rootScope.userAuthorized = true;
                        $rootScope.playerId = player[0]._id;
                    } else {
                        $log.log("User not authorized (Events).");
                    }
                });
        }
        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request user authentication with factory.
            $timeout(function () { init(); }, 1000);  // wait 1 second for callback.
        } else {
            init();
        }
        
    });