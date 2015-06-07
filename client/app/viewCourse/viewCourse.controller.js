/*
'use strict';

angular.module('phoenixGolfGuysApp')
  .controller('ViewCourseCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
*/

/*jslint nomen: true, node: true */
/*global angular */

// (function () {
//    var ViewCourseController = function ($state, $scope, $stateParams, $window, $log, coursesFactory, roundsFactory, playersFactory) {
angular.module('phoenixGolfGuysApp')
    .controller('ViewCourseCtrl', function ($scope,
                                             $state,
                                             $stateParams,
                                             $window,
                                             $log,
                                             coursesFactory,
                                             roundsFactory,
                                             playersFactory) {
        'use strict';
        var courseId = $stateParams.id,
            tee = {};
        $scope.course = null;
        $scope.rounds = null;
        $scope.tees = null;
        $scope.roundsFound = false;
        
        function init() {
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting Courses data; ', status);
                    $log.warn('Data: ', data);
                })
                .success(function (course) {
                    $scope.course = course;
            
                    coursesFactory.getCourseTees(courseId)
                        .success(function (tees) {
                            $scope.tees = tees;
                        })
                        .error(function (data, status, headers, config) {
                            $log.warn('Server error getting Tees data; ', status);
                            $log.warn('Data: ', data);
                        });
                    
                    roundsFactory.getCourseRounds(courseId)
                        .error(function (data, status, headers, config) {
                            $log.warn('Server error getting course rounds:', status);
                            $log.warn('Data: ', data);
                        })
                        .success(function (rounds) {
                            playersFactory.getPlayers()
                                .error(function (data, status, headers, config) {
                                    $log.warn('Server error getting player names: ', status);
                                    $log.warn('Data: ', data);
                                })
                                .success(function (players) {
                                    var i = Number,
                                        j = Number;
                                    for (i = 0; i < rounds.length; i += 1) {
                                        $scope.roundsFound = true;
                                        for (j = 0; j < players.length; j += 1) {
                                            if (rounds[i].playerId === players[j]._id) {
                                                rounds[i].playerName = players[j].firstName + " " + players[j].lastName;
                                                break;
                                            }
                                        }
                                    }
                                    $scope.rounds = rounds;
                                });
                        });
                });
        }
        
        init();

    });
    
//    ViewCourseController.$inject = ['$state', '$scope', '$stateParams', '$window', '$log', 'coursesFactory', 'roundsFactory', 'playersFactory'];

//    angular.module('phoenixGolfGuysApp').controller('ViewCourseController', ViewCourseController);