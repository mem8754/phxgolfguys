/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('PlayRoundCtrl', function ($scope, $state, $stateParams, $window, $log, $timeout, coursesFactory, roundsFactory) {
        var roundId = $stateParams.id;
        
        function calcDistance(lat1, lon1, lat2, lon2) {
            /*
            var R = 6371000; // metres
            var φ1 = lat1.toRadians();
            var φ2 = lat2.toRadians();
            var Δφ = (lat2-lat1).toRadians();
            var Δλ = (lon2-lon1).toRadians();

            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            var d = R * c;      
            */
            
            var Rm = 6371000,   // metres
                R = 6967840,    // yards
                phi1 = lat1 * Math.PI / 180,
                phi2 = lat2 * Math.PI / 180,
                deltaPhi = (lat2 - lat1) * Math.PI / 180,
                deltaLambda = (lon2 - lon1) * Math.PI / 180,

                a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                    Math.cos(phi1) * Math.cos(phi2) *
                    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2),
                
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),

                d = R * c;
            
            return d;
        }

        function init() {
            
            $scope.locAvail = false;
            roundsFactory.getActiveRound(roundId)
                .error(function (data, status) {
                    $log.warn('Server Error getting Round:' + status);
                })
                .success(function (round) {
                    $scope.round = round;
                    $scope.round.coordsUpdated = false;
                    $scope.hole = 1;
                    $scope.score = round.grossScore[0];
                
                    coursesFactory.getCourse($scope.round.courseId)
                        .error(function (data, status, headers, config) {
                            $log.warn("Server error reading Course data: ", status);
                        })
                        .success(function (course) {
                            $scope.course = course;
                            $scope.par = course.par[0];
                            $scope.holeLat = course.lat[0];
                            $scope.holeLon = course.lon[0];
                            $scope.firstHole = true;
                            $scope.lastHole = false;
                        
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
                                        if ($scope.yardage > 999) {
                                            $scope.yardage = 999;
                                        }
                                        if (position.coords.altitude) {
                                            $scope.altAvail = true;
                                        } else {
                                            $scope.altAvail = false;
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
                
                    coursesFactory.getTee($scope.round.teeId)
                        .error(function (data, status, headers, config) {
                            $log.warn("Server error reading Tee data: ", status);
                        })
                        .success(function (tee) {
                            $scope.tee = tee;
                            $scope.length = tee.yds[0];
                            $scope.teeName = tee.teeName;
                        });
                });
        }
   
        init();
    
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
                            if ($scope.yardage > 999) {
                                $scope.yardage = 999;
                            }
                            if (position.coords.altitude) {
                                $scope.altAvail = true;
                            } else {
                                $scope.altAvail = false;
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
    
        $scope.saveRound = function () {
            $log.info('Update this Round:', $scope.round);
            roundsFactory.saveActiveRound($scope.round)
                .error(function (data, status) {
                    $log.warn("Server error updating active round info: " + status);
                    $log.warn("Data: " + data);
                    $window.alert("Server error encountered, round not updated.");
                })
                .success(function (data, status) {
                    $window.alert("\nActive Round scores successfully updated.\n");
                    var userResp = $window.confirm("\nDo you want to post this round?\n");
                    if (userResp) {
                        $window.alert("\nRemember to save the round on the Update Round page to re-calculate your handicap.\n");
                        $state.go('editRound', { id: $scope.round._id });
                    }
                });
            
            if ($scope.courseUpdated) {
                coursesFactory.updateCourse($scope.course)
                    .error(function (data, status) {
                        $log.warn("Server error updating course info: ", status);
                        $window.alert("Server error encountered, course data not updated.");
                    })
                    .success(function (data, status) {
                        $window.alert("\nCourse details successfully updated.\n");
                    });
            }
        };
    
        $scope.nextHole = function () {
            $scope.round.grossScore[$scope.hole - 1] = $scope.score;

            $scope.hole += 1;
            if ($scope.hole > 18) {
                $scope.hole = 1;
            }

            $scope.firstHole = false;
            $scope.lastHole = false;
            if ($scope.hole === 1) {
                $scope.firstHole = true;
            } else if ($scope.hole === 18) {
                $scope.lastHole = true;
            }
 
            $scope.score = $scope.round.grossScore[$scope.hole - 1];
            $scope.par = $scope.course.par[$scope.hole - 1];
            $scope.length = $scope.tee.yds[$scope.hole - 1];
            $scope.holeLat = $scope.course.lat[$scope.hole - 1];
            $scope.holeLon = $scope.course.lon[$scope.hole - 1];

            $scope.yardage = 0;
            if ($scope.locAvail) {
                $scope.yardage = calcDistance($scope.position.coords.latitude,
                                          $scope.position.coords.longitude,
                                          $scope.holeLat,
                                          $scope.holeLon);
            }
            if ($scope.yardage > 999) {
                $scope.yardage = 999;
            }
        };
    
        $scope.prevHole = function () {
            $scope.round.grossScore[$scope.hole - 1] = $scope.score;

            $scope.hole -= 1;
            if ($scope.hole < 1) {
                $scope.hole = 18;
            }
            
            $scope.firstHole = false;
            $scope.lastHole = false;
            if ($scope.hole === 1) {
                $scope.firstHole = true;
            } else if ($scope.hole === 18) {
                $scope.lastHole = true;
            }
            
            $scope.score = $scope.round.grossScore[$scope.hole - 1];
            $scope.par = $scope.course.par[$scope.hole - 1];
            $scope.length = $scope.tee.yds[$scope.hole - 1];
            $scope.holeLat = $scope.course.lat[$scope.hole - 1];
            $scope.holeLon = $scope.course.lon[$scope.hole - 1];
 
            $scope.yardage = 0;
            if ($scope.locAvail) {
                $scope.yardage = calcDistance($scope.position.coords.latitude,
                                          $scope.position.coords.longitude,
                                          $scope.holeLat,
                                          $scope.holeLon);
            }
            if ($scope.yardage > 999) {
                $scope.yardage = 999;
            }
        };
    
        $scope.plusOne = function () {
            $scope.score += 1;
        };
    
        $scope.minusOne = function () {
            if ($scope.score > 0) {
                $scope.score -= 1;
            }
        };
    
        $scope.setGreenCenter = function () {
            var userResp = $window.confirm("\nUpdate green location for hole ", $scope.hole, "?\n");
            if (userResp) {
                if (!$scope.round.coords) {
                    $scope.round.coords = [];
                }
                $scope.round.coords[$scope.hole - 1] = $scope.position.coords;
                $scope.round.coordsUpdated = true;
            }
           
        };
        
    });