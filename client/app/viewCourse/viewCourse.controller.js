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
        
// Procedure to remove a Tee Box:
//      0.  confirm that no rounds exist for the tee box to be removed.      
//      1.  query the database for the Tee Box to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Courses factory to process the removal.
//      4.  confirm that the Tee Box has been removed by attempting to query again

        $scope.removeTeeBox = function (teeId) {                                                /*  Step 0  */
            roundsFactory.getTeeBoxRounds(teeId)
                .error(function (data, status, headers, config) {
                    $log.warn("Server error reading rounds for Tee Box remove: ", status);
                    $log.log("Data: ", data);
                    $window.alert("Unable to remove Tee Box; cannot confirm linked rounds.");
                    return;
                })
                .success(function (rounds) {
                    if (rounds !== null && rounds.length > 0) {
                        $window.alert("Rounds exist for this Tee Box, cannot delete.\n" +
                                      "Remove rounds before removing Tee Box.");
                        return;
                    }
                });
            coursesFactory.getTee(teeId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $window.alert("Server Error " + status + " retrieving Tee Box data.\nTee Box not removed.");
                })
                .success(function (tee) {
                    var userResp = $window.confirm("Remove " + tee.teeName + " Tee Box from " + tee.courseTag + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        coursesFactory.removeTeeBox(tee._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $window.alert("Server error " + status + " removing Tee Box.\nTee Box not removed from database.");
                            })
                            .success(function (data) {
                                coursesFactory.getTee(data.electionId)                                     /*  Step 4  */
                                    .error(function (data, status, headers, config) {
                                        $log.warn("Remove Tee Box - unable to confirm removal.", status);
                                        $window.alert("Tee Box removal requested, unable to confirm. Please refresh page.");
                                    })
                                    .success(function (tee) {
                                        if (null !== tee) {
                                            $window.alert("Error removing Tee Box.");
                                        } else {
                                            $window.alert("Tee Box successfully removed.");
                                            $state.go('viewCourse', { id : $scope.course._id });
                                        }
                                    });
                                
                            });
                    }
                });
        };
        

    });
    
//    ViewCourseController.$inject = ['$state', '$scope', '$stateParams', '$window', '$log', 'coursesFactory', 'roundsFactory', 'playersFactory'];

//    angular.module('phoenixGolfGuysApp').controller('ViewCourseController', ViewCourseController);