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
    
//==========================================================================================================
//  Function to update the rounds database and the coords database upon posting of a round.
//      1.  Save the round.
//      2.  Re-calculate player handicap (updates player record).
//      3.  Remove the active round.
//==========================================================================================================
    
        $scope.postRound = function (roundId) {
            $scope.activeRoundId = roundId;
            roundsFactory.getActiveRound(roundId)
                .error(function (data, status) {
                    $window.alert("\nServer error " + status + " reading active round.\n");
                })
                .success(function (round) {
                    if (round._id) {
                        delete round._id;
                    }
                    roundsFactory.addRound(round)
                        .error(function (data, status) {
                            $window.alert("\nServer error " + status + " adding new round.\n");
                        })
                        .success(function (data) {
                            $scope.calcHandicap();
                            roundsFactory.removeActiveRound($scope.activeRoundId)
                                .error(function (data, status) {
                                    $log.log("Server error " + status + " removing Active Round.");
                                })
                                .success(function (data) {});

                            $state.go("viewPlayer", { id: $scope.player._id });

                        });
                });
        };

    });