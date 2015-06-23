/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('ViewPlayerCtrl', function ($scope,
                                            $state,
                                            $stateParams,
                                            $window,
                                            $log,
                                            playersFactory,
                                            roundsFactory,
                                            eventsFactory,
                                            coursesFactory) {
        
        var playerId = $stateParams.id;
        
        $scope.player = {};
        $scope.rounds = [];
        $scope.eventsFound = false;
        $scope.roundsFound = false;
        $scope.activeRoundsFound = false;
        
// Procedure to remove a Round:
//      1.  query the database for the Round ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Rounds factory to process the removal.
//      4.  confirm that the Round has been removed by attempting to query again

        $scope.removeRound = function (roundId) {
            $scope.roundId = roundId;
            roundsFactory.getRound(roundId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Remove Round - server error reading Round info: ", status);
                    $window.alert("Unable to access Round in database.\nRound not removed.");
                })
                .success(function (round) {
                    var userResp = $window.confirm("Remove Round at " + round.courseTag + " on " + round.date + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        roundsFactory.removeRound(round._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $window.alert("Server error, round not removed.");
                            })
                            .success(function (data) {
                                roundsFactory.getRound($scope.roundId)                                   /*  Step 4  */
                                    .error(function (data, status, headers, config) {
                                        if (status === 404) {
                                            $window.alert("\nRound successfully removed.\n");
                                            $state.go('viewPlayer', {id: $stateParams.id});
                                        } else {
                                            $window.alert("Round removal requested, unable to confirm.");
                                        }
                                    })
                                    .success(function (round) {
                                        if (null !== round) {
                                            $window.alert("Server error removing Round; not removed.");
                                        } else {
                                            $window.alert("Round successfully removed.");
                                            $state.go('viewPlayer', {id: $stateParams.id});
                                        }
                                    });
                                
                            });
                    }
                });
        };

// Duplicate for removal of Active Rounds
    
        $scope.removeActiveRound = function (roundId) {
            $scope.roundId = roundId;
            roundsFactory.getActiveRound(roundId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Remove Round - server error reading Round info: ", status);
                    $window.alert("Unable to access Round in database.\nRound not removed.");
                })
                .success(function (round) {
                    var userResp = $window.confirm("Remove Active Round at " + round.courseTag + " on " + round.date + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        roundsFactory.removeActiveRound(round._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $window.alert("Server error, round not removed.");
                            })
                            .success(function (data) {
                                roundsFactory.getActiveRound($scope.roundId)                                   /*  Step 4  */
                                    .error(function (data, status, headers, config) {
                                        if (status === 404) {
                                            $window.alert("\nRound successfully removed.\n");
                                            $state.go('viewPlayer', {id: $stateParams.id});
                                        } else {
                                            $window.alert("Round removal requested, unable to confirm.");
                                        }
                                    })
                                    .success(function (round) {
                                        if (null !== round) {
                                            $window.alert("Server error removing Round; not removed.");
                                        } else {
                                            $window.alert("Round successfully removed.");
                                            $state.go('viewPlayer', {id: $stateParams.id});
                                        }
                                    });
                                
                            });
                    }
                });
        };

        function init() {
            playersFactory.getPlayer(playerId)
                .success(function (player) {
                    $scope.player = player;
                })
                .error(function (data, status, headers, config) {
                    $log.error('Error reading player details: ', status);
                });
            
            roundsFactory.getPlayerActiveRounds(playerId)
                .error(function (data, status) {
                
                })
                .success(function (playerActiveRounds) {
                    $scope.activeRounds = playerActiveRounds;
                    if (playerActiveRounds.length > 0) {
                        $scope.activeRoundsFound = true;
                    }
                });
            
            roundsFactory.getPlayerRounds(playerId)
                .success(function (playerRounds) {
                    $scope.rounds = playerRounds;
                    if (playerRounds.length > 0) {
                        $scope.roundsFound = true;
                    }
                })
                .error(function (data, status, headers, config) {
                    $log.warn('Error reading player rounds: ', status);
                });
            
            eventsFactory.getFutureEvents(playerId)
                .error(function (data, status, headers, config) {
                    $log.warn("Error reading player events: ", status);
                })
                .success(function (playerEvents) {
                    $scope.events = playerEvents.objSort("dateTime");
                    if (playerEvents.length > 0) {
                        $scope.eventsFound = true;
                        
//  Future tee times have been retrieved, and at least one exists. 
//  Retrieve course info and set a location for each event.
                        
                        coursesFactory.getCourses()
                            .error(function (data, status, headers, config) {
                                $log.warn("Error reading course info: ", status);
                            })
                            .success(function (courses) {
                                var i = 0,
                                    j = 0;
                                for (i = 0; i < $scope.events.length; i += 1) {
                                    for (j = 0; j < courses.length; j += 1) {
                                        if ($scope.events[i].courseId === courses[j]._id) {
                                            $scope.events[i].location = courses[j].tag;
                                            break;
                                        }
                                    }
                                }
                                
                            });
                    }
                });
        }
        
        init();

        $scope.calcHandicap = function () {
            $scope.hdcpIndex = playersFactory.calcPlayerHdcp($scope.rounds);
            playersFactory.updatePlayerHdcp($scope.player, $scope.hdcpIndex)
                .success(function (data) {
                    $window.alert("Player Handicap updated.");
                })
                .error(function (data, status, headers, config) {
                    $window.alert("Error writing updated handicap to database.");
                    $log.error('Data: ', data);
                    $log.error('Status: ', status);
                });
        };

    });