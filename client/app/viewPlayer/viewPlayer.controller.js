/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('ViewPlayerCtrl', function ($scope, $state, $stateParams, $window, $log, playersFactory, roundsFactory, eventsFactory) {
        
        var playerId = $stateParams.id;
        
        $scope.player = {};
        $scope.rounds = [];
        
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
        
        function init() {
            playersFactory.getPlayer(playerId)
                .success(function (player) {
                    $scope.player = player;
                })
                .error(function (data, status, headers, config) {
                    $log.error('Error reading player details: ', status);
                });
            
            roundsFactory.getPlayerRounds(playerId)
                .success(function (playerRounds) {
                    $scope.rounds = playerRounds;
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
//                    var i = 0,
//                        j = 0;
//                    $scope.events = [];
//                    for (i = 0; i < playerEvents.length; i += 1) {
//                        for (j = 0; j < playerEvents[i].players.length; j += 1) {
//                            if (playerEvents[i].players[j] === playerId) {
//                                $scope.events.push(playerEvents[i]);
//                                break;
//                            }
//                        }
//                    }
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