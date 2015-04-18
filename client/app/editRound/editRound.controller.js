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
                                 
        function init() {
            roundsFactory.getRound(roundId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server Error getting Round:', status);
                })
                .success(function (round) {
                    $scope.round = round;
                    $scope.playerId = round.playerId;

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