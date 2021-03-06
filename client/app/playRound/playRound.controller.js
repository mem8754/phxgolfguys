/*jslint node: true, nomen: true, plusplus: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('PlayRoundCtrl', function ($scope, $state, $stateParams, $window, $log, $timeout, coursesFactory, roundsFactory) {
        var roundId = $stateParams.id;

        function clone(obj) {
            var key = null,
                temp = null;
            if (obj === null || typeof (obj) !== 'object' || obj.hasOwnProperty('isActiveClone')) {
                return obj;
            }

            temp = obj.constructor(); // changed

            for (key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj.isActiveClone = null;
                    temp[key] = clone(obj[key]);
                    delete obj.isActiveClone;
                }
            }

            return temp;
        }
//-----------------------------------------------------------------------------------------------------------
// function to calculate the distance between two coordinate points (lat/lon pairs).
//-----------------------------------------------------------------------------------------------------------
    
        function calcDistance(lat1, lon1, lat2, lon2) {
            var R = 6967840,                                    // earth radius in yards
                phi1 = lat1 * Math.PI / 180,                    // latitude 1 in radians
                phi2 = lat2 * Math.PI / 180,                    // latitude 2 in radians
                deltaPhi = (lat2 - lat1) * Math.PI / 180,       // delta latitude in radians
                deltaLambda = (lon2 - lon1) * Math.PI / 180,    // delta longitude in radians

                a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                    Math.cos(phi1) * Math.cos(phi2) *
                    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2),
                
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),

                d = R * c;
            
            return d;
        }

//-----------------------------------------------------------------------------------------------------------
//  function to calculate the distances to present to the user: Green Center, Front, Back, and Hazards.
//-----------------------------------------------------------------------------------------------------------
    
        function calculateYardages() {
            var i = 0;
            $scope.centerYardage = 0;
            $scope.frontYardage = 0;
            $scope.backYardage = 0;
            
            if (!$scope.locAvail) {
                return;
            }
            
            $scope.centerYardage = calcDistance($scope.position.coords.latitude,
                                                $scope.position.coords.longitude,
                                                $scope.centerLat,
                                                $scope.centerLon);
            
            /*  Calculate distance to defined hole hazards.  */
            
            for (i = 0; i < $scope.hazards.length; i++) {
                $scope.hazards[i].reach = calcDistance($scope.position.coords.latitude,
                                                       $scope.position.coords.longitude,
                                                       $scope.hazards[i].loc[0],
                                                       $scope.hazards[i].loc[1]);
                $scope.hazards[i].carry = calcDistance($scope.position.coords.latitude,
                                                       $scope.position.coords.longitude,
                                                       $scope.hazards[i].loc[2],
                                                       $scope.hazards[i].loc[3]);
            }
        }
    
//-----------------------------------------------------------------------------------------------------------
// function to save the current round back to the database upon user request.
//-----------------------------------------------------------------------------------------------------------
    
        function saveActiveRound() {
            
            /*  Save current hole score and write the round to the database.  */
            
            $scope.round.grossScore[$scope.hole - 1] = $scope.score;
            roundsFactory.saveActiveRound($scope.round)
                .error(function (data, status) {})
                .success(function (data, status) {});
        }
    
//-----------------------------------------------------------------------------------------------------------
//  Function to change focus to another hole (up 1, down 1) or to re-focus on current hole (0). 
//      1.  save "score" into grossScore for current hole if moving (positive or negative parameter)
//          a.  no score save if staying on same hole (parameter = 0)
//      2.  set "hole" to the desired next value (up, down, stay, wrap at 18 and 1)
//      3.  get grossScore for the next hole, assign to "score"
//      4.  assign holeLat and holeLon from round.coords.latitude and round.coords.longitude
//      5.  if available, assign holeElev from round.coords.altitude (convert to feet)
//      6.  assign hole par, yds, hcp values from round.par, round.yds, round.hcp
//      7.  calculate yardage and elevation.
//      8.  convert accuracy from meters to yards (feet for altitude / elevation).
//      9.  save the round record.
//-----------------------------------------------------------------------------------------------------------

        function changeHole(incr) {
            var i = 1,
                j = 0,
                roundPar = 0,
                hazard = {};
            
        /*  Step 1: save score for current hole if we're switching to a different hole (param !== 0).  */
            if (incr !== 0) {
                $scope.round.grossScore[$scope.hole - 1] = $scope.score;
            }
        
        /*  Only allow a change to the next or previous hole. */
            if (incr > 0) { incr = 1; }
            if (incr < 0) { incr = -1; }
            

        /*  Step 2: move to the next hole, wrap at hole 18 (index 17).  */
            $scope.hole += incr;
            if ($scope.hole > 18) {
                $scope.hole = 1;
            } else if ($scope.hole < 1) {
                $scope.hole = 18;
            }

        /*  Step 3: set score to value for new hole, if defined, otherwise set score to null. */
            $scope.score = null;
            if (undefined !== $scope.round.grossScore[$scope.hole - 1]) {
                $scope.score = $scope.round.grossScore[$scope.hole - 1];
            }
        
        /*  Step 4: pick up hole latitude and longitude values for green center. Convert accuracy from meters to yards. */
            if ($scope.round.hole[$scope.hole - 1].flag) {
                $scope.centerLat = $scope.round.hole[$scope.hole - 1].flag[0];
                $scope.centerLon = $scope.round.hole[$scope.hole - 1].flag[1];
                if ($scope.round.hole[$scope.hole - 1].flag.length > 2) {
                    $scope.centerElev = $scope.round.hole[$scope.hole - 1].flag[2];
                }
            } else {
                $scope.centerLat = 0;
                $scope.centerLon = 0;
            }

        /*  Step 5: Load locations of hazards. First element (index 0 is the green location), will be pulled off array in next step. */
            $scope.hazards = [];
            for (i = 0; i < $scope.round.hole[$scope.hole - 1].locs.length; i++) {
                hazard = clone($scope.round.hole[$scope.hole - 1].locs[i]);
                $scope.hazards.push(hazard);
            }

        /*  Step 6: pick up new hole par, length, and handicap values */
            $scope.par = $scope.round.par[$scope.hole - 1];
            $scope.length = $scope.round.yds[$scope.hole - 1];
            $scope.hcp = $scope.round.hcp[$scope.hole - 1];

        /*  Step 7: calculate yardage to green front/center/back and to hazards (reach/clear) */
            calculateYardages();
            
        /*  Step 8: save the round record.  */
            saveActiveRound();
            
        /*  Step 9: calculate current round score  */
            $scope.roundScore = 0;
            $scope.roundPar = 0;
            for (i = 0; i < $scope.round.grossScore.length; i++) {
                if ($scope.round.grossScore[i]) {
                    $scope.roundScore += $scope.round.grossScore[i];
                    roundPar += $scope.round.par[i];
                }
            }
            $scope.toPar = $scope.roundScore - roundPar;
        
            return;
        }
//-----------------------------------------------------------------------------------------------------------
//  Initialize the controller.
//
//  Pull in the active round data and attempt to get current geolocation information.
//-----------------------------------------------------------------------------------------------------------
    
        function init() {
            $scope.showHazards = false;
            roundsFactory.getActiveRound(roundId)
                .error(function (data, status) {
                    $log.warn('Server Error getting Round:' + status);
                })
                .success(function (round) {
                    $scope.round = round;
                    $scope.playerId = round.playerId;
                    $scope.hole = 1;
                    $scope.roundScore = 0;
                    changeHole(0);      /*  call changeHole to initialize everything for first hole */
                 
// initial read of geolocation data and calculation of distances.
                
                    $scope.locAvail = false;
                    $scope.message = "Reading initial position ...";
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                $scope.locAvail = true;
                                $scope.message = "Success on initial read.";
                                $scope.position = position;
                                calculateYardages();
                                $scope.accuracy = $scope.position.coords.accuracy * 1.09361;
                            },
                            function error(msg) {
                                $log.log('Geolocation error: ' + msg);
                                $scope.locAvail = false;
                                $scope.message = "Error on initial read: " + msg;
                            },
                            {
                                maximumAge: 2000,
                                timeout: 1000,
                                enableHighAccuracy: true
                            }
                        );
                    } else {
                        $scope.message = "Geolocation is not available.";
                    }
                });
        }
   
//-----------------------------------------------------------------------------------------------------------
//  Main routine:
//
//  Call the initialization routine.
//  Set up a geolocation watch to continually update position information.
//-----------------------------------------------------------------------------------------------------------

        init();

// set up geolocation watching. When position changes, calculate new yardage and elevation deltas to green center.
    
        $timeout(function () {
            if ($scope.locAvail) {
                navigator.geolocation.watchPosition(
                    function (position) {
                        $scope.$apply(function () {
                            $scope.locAvail = true;
                            $scope.message = "Success on position update.";
                            $scope.position = position;
                            calculateYardages();
                            $scope.accuracy = $scope.position.coords.accuracy * 1.09361;
                        });
                    },
                    function error(msg) {
                        $scope.$apply(function () {
                            $scope.locAvail = false;
                            $scope.message = "Error on watch position update:" + msg;
                            $log.log("Geolocation error: ", msg);
                        });
                    },
                    {
                        maximumAge: 2000,
                        timeout: 1000,
                        enableHighAccuracy: true
                    }
                );
            }
        }, 2000);  // wait 2 seconds for callback exec.
    
    
//-----------------------------------------------------------------------------------------------------------
// function to save the current score and write the round to the database upon user request.
//-----------------------------------------------------------------------------------------------------------
    
        $scope.endRound = function () {
            var userResp = $window.confirm("\nFinish current round?\n");
            if (!userResp) {
                return;
            }
            
            $scope.round.grossScore[$scope.hole - 1] = $scope.score;
            saveActiveRound();
            $state.go("viewPlayer", { id: $scope.playerId });
        };
    
//-----------------------------------------------------------------------------------------------------------
// function to move to the next hole.
//-----------------------------------------------------------------------------------------------------------
    
        $scope.nextHole = function () {
            changeHole(+1);
        };

//-----------------------------------------------------------------------------------------------------------
// function to move to the previous hole.
//-----------------------------------------------------------------------------------------------------------
    
        $scope.prevHole = function () {
            changeHole(-1);
        };
    
//-----------------------------------------------------------------------------------------------------------
// function to increment the current score by one.
//-----------------------------------------------------------------------------------------------------------
    
        $scope.plusOne = function () {
            if ($scope.score === null) {
                $scope.score = $scope.round.par[$scope.hole - 1];
            } else {
                $scope.score += 1;
            }
        };
    
//-----------------------------------------------------------------------------------------------------------
// function to decrement the current score by one; don't go below zero.
//-----------------------------------------------------------------------------------------------------------
    
        $scope.minusOne = function () {
            if ($scope.score === null) {
                $scope.score = $scope.round.par[$scope.hole - 1];
            } else {
                if ($scope.score > 0) {
                    $scope.score -= 1;
                }
            }
        };
        
//-----------------------------------------------------------------------------------------------------------
// Procedure to toggle the display of the hazards on the DOM.
//-----------------------------------------------------------------------------------------------------------
        $scope.toggleHazards = function () {
            $scope.showHazards = !$scope.showHazards;
        };
    
//-----------------------------------------------------------------------------------------------------------
//  Procedure to save the current position's "altitude" parameter as "flag" elevation, converted from meters to feet.
//-----------------------------------------------------------------------------------------------------------
        $scope.setGreenElev = function () {
            var alt = $scope.position.coords.altitude * 3 * 1.09361;
            if ($scope.round.hole[$scope.hole - 1].flag.length > 2) {
                $scope.round.hole[$scope.hole - 1].flag[2] = alt;
            } else {
                $scope.round.hole[$scope.hole - 1].flag.push(alt);
            }
            
            $scope.round.modified = true;       /*  flag to let post round controller know to update coordinates collection  */
        };
    
//-----------------------------------------------------------------------------------------------------------
// Procedure to remove an Active Round:
//      1.  query the database for the Active Round ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Rounds factory to process the removal.
//      4.  confirm that the Active Round has been removed by attempting to query again
//-----------------------------------------------------------------------------------------------------------

    
        $scope.removeThisActiveRound = function () {
            var userResp = $window.confirm("\nDelete current round?\n");
            if (userResp) {
                roundsFactory.removeActiveRound($scope.round._id)
                    .error(function (data, status, headers, config) {
                        $window.alert("Server error, round not removed.");
                    })
                    .success(function (data) {
                        $scope.round = {};
                        $state.go('viewPlayer', {id: $scope.playerId});
                    });
            }
        };

    });