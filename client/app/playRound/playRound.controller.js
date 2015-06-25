/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('PlayRoundCtrl', function ($scope, $state, $stateParams, $window, $log, $timeout, coursesFactory, roundsFactory) {
        var roundId = $stateParams.id;
        
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
// function to save the current round back to the database upon user request.
//-----------------------------------------------------------------------------------------------------------
    
        function saveActiveRound() {
            
            /*  Save current hole score and write the round to the database.  */
            
            $scope.round.grossScore[$scope.hole] = $scope.score;
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
//      8.  save the round record.
//-----------------------------------------------------------------------------------------------------------

        function changeHole(i) {
        /*  Step 1: save score for current hole if we're switching to a different hole (param !== 0).  */
            if (i !== 0) {
                $scope.round.grossScore[$scope.hole] = $scope.score;
            }
        
        /*  Only allow a change to the next or previous hole. */
            if (i > 0) { i = 1; }
            if (i < 0) { i = -1; }
            

        /*  Step 2: move to the next hole, wrap at hole 18 (index 17).  */
            $scope.hole += i;
            if ($scope.hole > 17) {
                $scope.hole = 0;
            } else if ($scope.hole < 0) {
                $scope.hole = 17;
            }

        /*  Step 2 (add'l): set flags for first hole and last hole. */
            $scope.firstHole = false;
            $scope.lastHole = false;
            if ($scope.hole === 0) {
                $scope.firstHole = true;
            } else if ($scope.hole === 17) {
                $scope.lastHole = true;
            }
 
        /*  Step 3: set score to value for new hole. */
            $scope.score = $scope.round.grossScore[$scope.hole];
        
        /*  Step 4: pick up hole latitude and longitude values for green center */
            if ($scope.round.greenCenter[$scope.hole].latitude) {
                $scope.holeLat = $scope.round.greenCenter[$scope.hole].latitude;
                $scope.accuracy = $scope.round.greenCenter[$scope.hole].accuracy;
            } else {
                $scope.holeLat = 0;
                $scope.accuracy = 999;
            }
            if ($scope.round.greenCenter[$scope.hole].longitude) {
                $scope.holeLon = $scope.round.greenCenter[$scope.hole].longitude;
            } else {
                $scope.holeLon = 0;
            }

        /*  Step 5: pick up new hole elevation value */
            if ($scope.round.greenCenter[$scope.hole].altitude) {
                $scope.holeElev = $scope.round.greenCenter[$scope.hole].altitude;
                $scope.elevAccuracy = $scope.round.greenCenter[$scope.hole].altitudeAccuracy;
            } else {
                $scope.holeElev = 0;
                $scope.elevAccuracy = 999;
            }
 
        /*  Step 6: pick up new hole par, length, and handicap values */
            $scope.par = $scope.round.par[$scope.hole];
            $scope.length = $scope.round.yds[$scope.hole];
            $scope.hcp = $scope.round.hcp[$scope.hole];

        /*  Step 7: calculate yardage and elevation to hole */
            $scope.yardage = 0;
            if ($scope.locAvail) {
                $scope.yardage = calcDistance($scope.position.coords.latitude,
                                          $scope.position.coords.longitude,
                                          $scope.holeLat,
                                          $scope.holeLon);
            
                $scope.elevation = $scope.holeElev - $scope.position.coords.altitude;
            }
        
        /*  Step 8: save the round record.  */
            saveActiveRound();
        
            return;
        }
    
        function init() {
            
            $scope.locAvail = false;
            roundsFactory.getActiveRound(roundId)
                .error(function (data, status) {
                    $log.warn('Server Error getting Round:' + status);
                })
                .success(function (round) {
                    $scope.round = round;
                    $scope.hole = 0;
                    changeHole(0);      /*  call changeHole to initialize everything for first hole */
                 
// initial read of geolocation data and calculation of distances.
                
                    if (navigator.geolocation) {
                        $scope.locAvail = false;
                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                $scope.locAvail = true;
                                $scope.position = position;
                                $scope.yardage = calcDistance($scope.position.coords.latitude,
                                                              $scope.position.coords.longitude,
                                                              $scope.holeLat,
                                                              $scope.holeLon);
                                if (position.coords.altitude) {
                                    $scope.altAvail = true;
                                    $scope.elevation = $scope.holeElev - $scope.position.coords.altitude;
                                } else {
                                    $scope.altAvail = false;
                                    $scope.elevation = 0;
                                }
                            },
                            function error(msg) {
                                $log.log("Geolocation error: ", msg);
                                $window.alert('Please enable your GPS position.');
                            },
                            {
                                maximumAge: 1000,
                                timeout: 500,
                                enableHighAccuracy: true
                            }
                        );
                    } else {
                        $window.alert("Geolocation is not supported by your device/browser.");
                    }
                });
        }
   
        init();

// set up geolocation watching. When position changes, calculate new yardage and elevation deltas to green center.
    
        $timeout(function () {
            if ($scope.locAvail) {
                navigator.geolocation.watchPosition(
                    function (position) {
                        $scope.$apply(function () {
                            $scope.position = position;
                            $scope.yardage = calcDistance($scope.position.coords.latitude,
                                                        $scope.position.coords.longitude,
                                                        $scope.holeLat,
                                                        $scope.holeLon);
                            if (position.coords.altitude) {
                                $scope.altAvail = true;
                                $scope.elevation = $scope.holeElev - $scope.position.coords.altitude;
                                
                            } else {
                                $scope.altAvail = false;
                                $scope.elevation = 0;
                            }
                        });
                    },
                    function error(msg) {
                        $log.log("Geolocation error: ", msg);
                    },
                    {
                        maximumAge: 1000,
                        timeout: 500,
                        enableHighAccuracy: true
                    }
                );
            }
        }, 2000);  // wait 2 seconds for callback exec.
    
    
    
// function to save the current score and write the round to the database upon user request.
    
        $scope.saveRound = function () {
            $scope.round.grossScore[$scope.hole] = $scope.score;
            saveActiveRound();
        };
    
// function to move to the next hole.
    
        $scope.nextHole = function () {
            changeHole(+1);
        };

// function to move to the previous hole.
    
        $scope.prevHole = function () {
            changeHole(-1);
        };
    
// function to increment the current score by one.
    
        $scope.plusOne = function () {
            $scope.score += 1;
        };
    
// function to decrement the current score by one; don't go below zero.
    
        $scope.minusOne = function () {
            if ($scope.score > 0) {
                $scope.score -= 1;
            }
        };
    
// function to set the coordinates of the green center upon user selection.
    
        $scope.setGreenCenter = function () {
            var userResp = $window.confirm("\nUpdate green location for hole ", $scope.hole + 1, "?\n");
            if (userResp) {
                $scope.round.greenCenter[$scope.hole] = $scope.position.coords;
            }
           
        };
        
// Procedure to remove an Active Round:
//      1.  query the database for the Active Round ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Rounds factory to process the removal.
//      4.  confirm that the Active Round has been removed by attempting to query again

    
        $scope.removeThisActiveRound = function () {
            var userResp = $window.confirm("\nDelete current round?\n");
            if (userResp) {
                userResp = $window.confirm("\nWARNING: All updated round data will be lost!!!\n" +
                                           "Select 'OK' to delete, or 'Cancel' to continue with this round.\n");
                if (userResp) {
                    roundsFactory.removeActiveRound($scope.round._id)
                        .error(function (data, status, headers, config) {
                            $window.alert("Server error, round not removed.");
                        })
                        .success(function (data) {
                            $window.alert("\nRound successfully removed.\n");
                            $scope.round = {};
                            $state.go('main');
                        });
                }
            }
        };

    });