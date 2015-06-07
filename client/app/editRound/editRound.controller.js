/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EditRoundCtrl', function ($scope, $state, $stateParams, $window, $log, coursesFactory, playersFactory, roundsFactory) {
        var roundId = $stateParams.id;
        $scope.round = {
            course: '',
            tee: '',
            grossScore: [],
            adjGrossScore: []
        };
        $scope.hcpData = {};

// Procedure to remove a Round:
//      1.  query the database for the Round ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Rounds factory to process the removal.
//      4.  confirm that the Round has been removed by attempting to query again

        $scope.removeRound = function (roundId) {
            $scope.roundId = roundId;
            
            // Step 1
            roundsFactory.getRound(roundId)
                .error(function (data, status, headers, config) {
                    $log.warn("Remove Round - server error reading Round info: ", status);
                    $window.alert("Unable to access Round in database.\nRound not removed.");
                })
                .success(function (round) {
                    var userResp = $window.confirm("Remove Round at " + round.courseTag + " on " + round.date + "?");
                    if (userResp) {
                        
                        // Step 2
                        
                        roundsFactory.removeRound(round._id)
                        
                        // Step 3
                        
                            .error(function (data, status, headers, config) {
                                $window.alert("Server error, round not removed.");
                            })
                            .success(function (data) {
                                roundsFactory.getRound($scope.roundId)
                                
                                // Step 4
                                
                                    .error(function (data, status, headers, config) {
                                        if (status === 404) {
                                            $window.alert("\nRound successfully removed.\n");
                                            $state.go('viewPlayer', {id: $scope.playerId});
                                        } else {
                                            $window.alert("Removal requested, unable to confirm.");
                                        }
                                    })
                                    .success(function (round) {
                                        if (null !== round) {
                                            $window.alert("Server error, Round not removed.");
                                        } else {
                                            $window.alert("Round successfully removed.");
                                            $state.go('viewPlayer', {id: $scope.playerId});
                                        }
                                    });
                                
                            });
                    }
                });
        };
        
    
        
        $scope.updateTeeBoxes = function () {
// this function refreshes the Tee Box list when the course selection changes.  
            coursesFactory.getCourseTees($scope.round.courseId)
                .error(function (data, status, headers, config) {
                    $log.log("Server error " + status + " retrieving Tee Box details for selected course");
                })
                .success(function (tees) {
                    if (tees !== null && tees.length > 0) {
                        $scope.tees = tees.objSort("rating", -1);
                    } else {
                        $window.alert("No tee boxes are defined for this course.\nPlease select a different course or add Tee Box info.");
                    }
                });
        };
        
        $scope.updateHcpParms = function (teeId) {
            var i = 0;
            for (i = 0; i < $scope.tees.length; i += 1) {
                if ($scope.tees[i]._id === $scope.round.teeId) {
                    $scope.hcpData.slopeRating = $scope.tees[i].slope;
                    $scope.hcpData.courseRating = $scope.tees[i].rating;
                    return;
                }
            }
        };
    
        function init() {
            roundsFactory.getRound(roundId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server Error getting Round:', status);
                })
                .success(function (round) {
                    $scope.round = round;
                    $scope.playerId = round.playerId;
                
                    coursesFactory.getCourses()
                        .error(function (data, status, headers, config) {
                            $log.warn('Server error getting courses: ', status);
                        })
                        .success(function (courses) {
                            $scope.courses = courses;
                            $scope.updateTeeBoxes();
                        });


                    playersFactory.getPlayerHcp(round.playerId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Error ', status, ' getting Player Hcp: ', data);
                        })
                        .success(function (player) {
                            $scope.playerName = player.firstName + " " + player.lastName;
                            $scope.round.hdcpIndex = player.hdcp;
                        });

                    coursesFactory.getCourseHdcp(round.courseId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Error getting Course Hcp: ', status);
                        })
                        .success(function (course) {
                            $scope.round.courseTag = course.tag;
                            $scope.hcpData.par = course.par;
                            if (round.grossScore.length === 0) {
                                $scope.round.grossScore = course.par;
                            }
                        });
                    coursesFactory.getTee(round.teeId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Server Error ' + status + ' retrieving Tee Box data.');
                        })
                        .success(function (tee) {
                            $scope.hcpData.courseRating = tee.rating;
                            $scope.hcpData.slopeRating = tee.slope;
                            $scope.teeName = tee.teeName;
                        });
                });
        }
   
        init();
    

        $scope.updateRound = function () {
            $log.info('Update this Round:', $scope.round);
            roundsFactory.updateRound($scope.round, $scope.hcpData)
                .error(function (data, status) {
                    $log.warn("Server error updating round info: ", status);
                    $log.warn("Data: ", data);
                    $window.alert("Server error encountered, round not updated.");
                })
                .success(function (data, status) {
                    $window.alert("Round successfully updated.");
                    $state.go('viewPlayer', { id: $scope.playerId });

                });

        };
    });