/*jslint node: true, nomen: true, plusplus: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('AddActiveRoundCtrl', function ($scope,
                                                $rootScope,
                                                $state,
                                                $stateParams,
                                                $window,
                                                $log,
                                                playersFactory,
                                                coursesFactory,
                                                eventsFactory,
                                                roundsFactory) {
        
        
        function init() {
            
            var teeTimeId = $stateParams.id;
            $scope.round = {};
            eventsFactory.getTeeTime(teeTimeId)
                .error(function (data, status) {
                    $log.log('Server Error ' + status + ' getting tee time.');
                })
                .success(function (teeTime) {
                    $scope.round.date = teeTime.dateTime;
                    $scope.round.courseId = teeTime.courseId;
                    $scope.round.playerId = $rootScope.playerId;
                
                    playersFactory.getPlayer($rootScope.playerId)
                        .error(function (data, status, headers, config) {
                            $log.log('Server Error ' + status + ' getting player data.');
                        })
                        .success(function (player) {
                            $scope.playerName = player.firstName + " " + player.lastName;
                        });

                    coursesFactory.getCourse($scope.round.courseId)
                        .error(function (data, status) {
                            $log.log('Server Error ' + status + ' retrieving Course for new Active Round.');
                        })
                        .success(function (course) {
                            var i = 0;
                            $scope.round.courseTag = course.tag;
                            $scope.round.par = course.par;
                            $scope.round.grossScore = [];
                            for (i = 0; i < 18; i++) {
                                $scope.round.grossScore[i] = course.par[i];
                            }
                            $scope.round.hcp = course.hcp;
                        
                        // if GPS coorinates exist for the course, use them.
                        
                            if (course.coords) {
                                $scope.round.coords = course.coords;
                            } else {
                                
                        // if no GPS coordinates, see if lat/lon data is avail to use.
                        // (will phase out lat/lon in favor of GPS coords over time)
                                if (course.lat) {
                                    $scope.round.coords = {};
                                    $scope.round.coords.latitude = course.lat;
                                    $scope.round.coords.longitude = course.lon;
                                }
                            }
                        });
                
                    coursesFactory.getCourseTees($scope.round.courseId)
                        .error(function (data, status) {
                            $log.log('Server Error ' + status + ' retrieving Tees for new Active Round.');
                        })
                        .success(function (tees) {
                            $scope.tees = tees.objSort("rating", -1);
                        });
                });
        }
   
        init();
        
//==========================================================================================
//  Function to post an active round to the "activeRounds" database (via the rounds Factory)
//      Steps to add round:
//      1.  Query DB for the requested tee box
//      2.  Confirm tee's course ID is equal to selected course ID ($scope.round.courseId)
//      3.  Add tee's name to the activeRound object
//      4.  Query DB for the requested course
//      5.  Add course's tag to the activeRound object
//      4.  Post the skeleton activeRound information to the database via call to Factory
//==========================================================================================
        
        $scope.addThisRound = function () {
            var i = 0;
            $log.info('Add Active Round:', $scope.round);
//
            coursesFactory.getTee($scope.round.teeId)                   /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Server Error " + status + " retrieving tee information.");
                })
                .success(function (tee) {
                    if (tee === null) {
                        $window.alert("Unable to retrieve Tee Box information.\nRound not added.");
                        return;
                    }
                
                    if (tee.courseId !== $scope.round.courseId) {       /*  Step 2  */
                        $window.alert("Internal Error: Selected Tee Box is not for selected Course.\nUnable to post round.");
                        return;
                    }
                    $scope.round.teeName = tee.teeName;                 /*  Step 3  */
                    $scope.round.yds = tee.yds;

                    roundsFactory.addActiveRound($scope.round)        /*  Step 6  */
                        .error(function (data, status) {
                            $window.alert("Server error " + status + " posting active round.\nRound not added.");
                        })
                        .success(function (data) {
                            $window.alert("Active Round successfully added to database.");
                            $state.go('viewPlayer', {id: $rootScope.playerId });
                        });
                    
                });
        };
        
    });