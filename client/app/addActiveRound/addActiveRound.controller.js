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
                                                coursesFactory,
                                                eventsFactory,
                                                roundsFactory) {
        
        
        function init() {
            
            var teeTimeId = $stateParams.id;
            $scope.round = {};
            $scope.round.modified = false;
            eventsFactory.getTeeTime(teeTimeId)
                .error(function (data, status) {
                    $log.log('Server Error ' + status + ' getting tee time.');
                })
                .success(function (teeTime) {
                    var i = 0,
                        userResp = false;
                
                    for (i = 0; i < teeTime.players.length; i += 1) {
                        if (teeTime.players[i] === $rootScope.playerId) {
                            $scope.round.playerId = teeTime.players[i];
                            break;
                        }
                    }
                    if (!$scope.round.playerId) {
                        userResp = $window.confirm("\nplayer not found on this teeTime, playerId=" + $rootScope.playerId + "\n" +
                                                   "Are you sure you want to add this active round?\n");
                        if (!userResp) {
                            $state.go("viewPlayer", { id: $rootScope.playerId });
                        } else {
                            $scope.round.playerId = $rootScope.playerId;
                        }
                    }
                
                    $scope.round.date = teeTime.dateTime;
                    $scope.round.courseId = teeTime.courseId;
                 
                    coursesFactory.getCourse($scope.round.courseId)
                        .error(function (data, status) {
                            $log.log('Server Error ' + status + ' retrieving Course for new Active Round.');
                        })
                        .success(function (course) {
                            var i = 0;
                            $scope.round.courseTag = course.tag;
                            $scope.round.par = course.par;
                            $scope.round.grossScore = [];
                            $scope.round.hcp = course.hcp;
                        
                        });
                
                // add the GPS coordinates for the course (if any) to the active round.
                        
                    coursesFactory.getCourseCoords($scope.round.courseId)
                        .error(function (data, status) {
                            $log.log('Server error ' + status + ' retrieving Course Coords for new Active Round.');
                        })
                        .success(function (coords) {
                            $scope.round.hole = coords[0].hole;
                        });
                
                //  get tees for this course to allow user selection via the DOM.
                
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
//      1.  locate the requested tee box
//      2.  Confirm tee's course ID is equal to selected course ID ($scope.round.courseId)
//      3.  Add tee's name to the activeRound object
//      4.  Query DB for the requested course
//      5.  Add course's tag to the activeRound object
//      4.  Post the skeleton activeRound information to the database via call to Factory
//==========================================================================================
        
        $scope.addThisRound = function () {
            var i = 0,
                tee = {};
            
            $log.info('Add Active Round:', $scope.round);
//
            for (i = 0; i < $scope.tees.length; i++) {
                if ($scope.tees[i]._id === $scope.round.teeId) {
                    tee = $scope.tees[i];
                    break;
                }
            }
            if (tee === null) {
                $window.alert("Unable to find Tee Box information.\nRound not added.");
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
                    $window.alert("\nServer error " + status + " posting active round.\nRound not added.\n");
                })
                .success(function (data) {
                    $window.alert("\nActive Round successfully added to database.\n");
                    $state.go('viewPlayer', {id: $rootScope.playerId });
                });
        };
        
    });