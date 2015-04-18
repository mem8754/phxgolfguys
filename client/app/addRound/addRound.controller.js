/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('AddRoundCtrl', function ($scope,
                                           $state,
                                           $stateParams,
                                           $window,
                                           $log,
                                           playersFactory,
                                           coursesFactory,
                                           roundsFactory) {
        var playerId = $stateParams.id;
        
        $scope.round = {};

        function init() {
            
            // dummy code to test the select control with ng-options.
            $scope.filterCondition = {
                operator: 'eq'
            };

            $scope.operators = [
                {value: 'eq', displayName: 'equals'},
                {value: 'neq', displayName: 'not equal'}
            ];
            
            // and now on to the business at hand ...
            
            playersFactory.getPlayerHcp(playerId)
                .error(function (data, status, headers, config) {
                    $log.log('Server Error ' + status + ' getting player data.');
                })
                .success(function (player) {
                    $scope.round.playerId = playerId;
                    $scope.playerName = player.firstName + " " + player.lastName;
                
                    coursesFactory.getCourses()
                        .error(function (data, status, headers, config) {
                            $log.log('Server Error ' + status + ' retrieving Courses for New Round.');
                        })
                        .success(function (courses) {
                            $scope.courses = courses.objSort("state", "tag");
                        });
                });
        }
   
        init();
        
        $scope.updateTeeBoxes = function () {
// this function refreshes the Tee Box list when the course selection changes.  
            coursesFactory.getCourseTees($scope.round.courseId)
                .error(function (data, status, headers, config) {
                    $log.log("Server error " + status + " retrieving Tee Box details for selected course");
                })
                .success(function (tees) {
                    if (tees !== null && tees.length > 0) {
                        $scope.tees = tees.objSort("rating", -1);
                    } else {
                        $window.alert("No tee boxes are defined for this course.\nPlease select a different course or add Tee Box info.");
                    }
                });
        };
        
//==========================================================================================
//  Function to post a round to the "rounds" database (via the rounds Factory)
//      Steps to add round:
//      1.  Query DB for the requested tee box
//      2.  Confirm tee's course ID is equal to selected course ID ($scope.round.courseId)
//      3.  Add tee's name to the round object
//      4.  Query DB for the requested course
//      5.  Add course's tag to the round object
//      4.  Post the skeleton round information to the database via call to Factory
//==========================================================================================
        
        $scope.addRound = function () {
            var i = 0;
            $log.info('Add Round:', $scope.round);
//
            coursesFactory.getTee($scope.round.teeId)                   /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.warn("Server Error " + status + " retrieving tee information.");
                })
                .success(function (tee) {
                    if (tee === null) {
                        $window.alert("Unable to retrieve Tee Box information.\nRound not added.");
                        return;
                    }
                
                    if (tee.courseId !== $scope.round.courseId) {       /*  Step 2  */
                        $window.alert("Internal Error: Selected Tee Box is not for selected Course.\nUnable to post round.");
                        return;
                    }
                    $scope.round.teeName = tee.teeName;                 /*  Step 3  */
                
                    coursesFactory.getCourse($scope.round.courseId)     /*  Step 4  */
                        .error(function (data, status, headers, config) {
                            $log.log("Server Error " + status + " retrieving course information.");
                        })
                        .success(function (crs) {
                            $scope.round.courseTag = crs.tag;           /*  Step 5  */

                            roundsFactory.addRound($scope.round)        /*  Step 6  */
                                .error(function (data, status, headers, config) {
                                    $window.alert("Server error " + status + " posting round.\nRound not posted.");
                                })
                                .success(function (data, status, headers, config) {
                                    $window.alert("Round successfully added to database.\n" +
                                                  "Update the round to post scores.");
                                    $state.go('viewPlayer', {id: $stateParams.id });
                                });
                        });
                });
        };
        
    });