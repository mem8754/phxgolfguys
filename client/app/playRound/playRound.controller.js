/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('PlayRoundCtrl', function ($scope, $state, $stateParams, $window, $log, coursesFactory, roundsFactory) {
        var roundId = $stateParams.id;
    
        function calcDist(lat1, lon1, lat2, lon2) {
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
                p1 = lat1 * Math.PI / 180,
                p2 = lat2 * Math.PI / 180,
                Dp = (lat2 - lat1) * Math.PI / 180,
                Dl = (lon2 - lon1) * Math.PI / 180,

                a = Math.sin(Dp / 2) * Math.sin(Dp / 2) +
                    Math.cos(p1) * Math.cos(p2) *
                    Math.sin(Dl / 2) * Math.sin(Dl / 2),
                
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),

                d = R * c;
            
            return d;
        }

        function init() {
            
            roundsFactory.getRound(roundId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server Error getting Round:', status);
                })
                .success(function (round) {
                    $scope.round = round;
                    $scope.courseTag = $scope.round.courseTag;
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
        if ("geolocation" in navigator) {
            $scope.locAvail = true;
            navigator.geolocation.watchPosition(function (position) {
                $scope.lat = position.coords.latitude;
                $scope.lon = position.coords.longitude;
                $scope.yardage = calcDist($scope.lat, $scope.lon, $scope.holeLat, $scope.holeLon);
            });
        } else {
            $scope.locAvail = false;
        }
    
        $scope.saveRound = function () {
            $log.info('Update this Round:', $scope.round);
            roundsFactory.saveRound($scope.round)
                .error(function (data, status) {
                    $log.warn("Server error updating round info: ", status);
                    $log.warn("Data: ", data);
                    $window.alert("Server error encountered, round not updated.");
                })
                .success(function (data, status) {
                    $window.alert("\nRound scores successfully updated.\n" +
                                  "Please save round on next screen.\n");
                    $state.go('editRound', { id: $scope.round._id });

                });

        };
    
        $scope.nextHole = function () {
            $scope.round.grossScore[$scope.hole - 1] = $scope.score;
            $scope.hole += 1;
            if ($scope.hole > 18) {
                $scope.hole = 1;
            }
            $scope.score = $scope.round.grossScore[$scope.hole - 1];
            $scope.holeLat = $scope.course.lat[$scope.hole - 1];
            $scope.holeLon = $scope.course.lon[$scope.hole - 1];
            $scope.yardage = calcDist($scope.lat, $scope.lon, $scope.holeLat, $scope.holeLon);
        };
    
        $scope.prevHole = function () {
            $scope.round.grossScore[$scope.hole - 1] = $scope.score;
            $scope.hole -= 1;
            if ($scope.hole < 1) {
                $scope.hole = 18;
            }
            $scope.score = $scope.round.grossScore[$scope.hole - 1];
            $scope.holeLat = $scope.course.lat[$scope.hole - 1];
            $scope.holeLon = $scope.course.lon[$scope.hole - 1];
            $scope.yardage = calcDist($scope.lat, $scope.lon, $scope.holeLat, $scope.holeLon);
        };
    
        $scope.plusOne = function () {
            $scope.score += 1;
        };
    
        $scope.minusOne = function () {
            if ($scope.score > 0) {
                $scope.score -= 1;
            }
        };
    
        
    });