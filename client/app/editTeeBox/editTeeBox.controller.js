/*jslint nomen: true, node: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EditTeeBoxCtrl', function ($scope, $state, $stateParams, $window, $log, coursesFactory, roundsFactory) {
        $scope.tee = {};
        $scope.course = {};
        $scope.addTee = false;
        
        function init() {
            coursesFactory.getTee($stateParams.id)
                .error(function (data, status, headers, config) {
                    $log.error("Server error reading tee info for Edit Tee Box: ", status);
                    $log.error("Data: ", data);
                    $window.alert("Server error reading tee information.");
                })
                .success(function (tee) {
                    $scope.tee = tee;
                    $scope.name = tee.teeName;
                    coursesFactory.getCourse(tee.courseId)
                        .error(function (data, status, headers, config) {
                            $log.error('Server error reading course info for Edit Tee Box: ', status);
                            $log.error('Data: ', data);
                        })
                        .success(function (course) {
                            $scope.course = course;
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
                    var userResp = $window.confirm("Remove " + tee.teeName + " Tee Box from " + $scope.course.tag + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        coursesFactory.removeTeeBox(tee._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $window.alert("Server error " + status + " removing Tee Box.\nTee Box not removed from database.");
                                $state.go('viewCourse', { id: $scope.course._id});
                            })
                            .success(function (data) {
                                $window.alert("Tee Box successfully removed.");
                                $state.go('viewCourse', { id : $scope.course._id });
                            });
                    }
                });
        };
        
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateTeeBox = function () {
            var i = 0;
            $log.log('Update Tee Box:', $scope.tee.teeName);
//
//==========================================================================================
//  Steps to update tee box:
//      1.  Query DB for tee info using "$scope.course._id"
//      2.  loop through returned course tees to locate a match on user-provided tee name, quit if found
//      3.  calculate front ([18]), back ([19], and total ([20] yardages
//      4.  update this tee box info in the database
//==========================================================================================
            coursesFactory.getCourseTees($scope.course._id)                           /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $log.error("Add Tee Box - course tees not retrieved. ", status);
                    $window.alert("Error on update: unable to load existing course tees.");
                })
                .success(function (tees) {
                    if (tees !== null) {                                        /*  Step 2 */
                        for (i = 0; i < tees.length; i += 1) {
                            if (tees[i].teeName === $scope.tee.teeName && tees[i]._id !== $scope.tee._id) {
                                $window.alert("A separate tee box with that name already exists.\nPlease provide a different name");
                                return;
                            }
                        }
                    }

// if we make it here, the tee box name does not exist in the DB for this course for any other defined tee, and can be updated.

                    $scope.tee.yds[18] = 0;
                    $scope.tee.yds[19] = 0;
                    $scope.tee.yds[20] = 0;                                     /*  Step 3 */
                    for (i = 0; i < 9; i += 1) {
                        $scope.tee.yds[18] += $scope.tee.yds[i];
                        $scope.tee.yds[19] += $scope.tee.yds[i + 9];
                    }
                    $scope.tee.yds[20] = $scope.tee.yds[18] + $scope.tee.yds[19];

                    coursesFactory.updateTee($scope.tee)                        /*  Step 4  */
                        .success(function (data) {
                            $log.log("Data: ", data);
                            $window.alert("Tee Box successfully updated.");
                            $state.go('viewCourse', { id: $scope.tee.courseId });

                        })
                        .error(function (data, status, headers, config) {
                            $log.error("Edit Tee Box - error updating database: ", status);
                            $window.alert("Server error updating round.");
                        });
                });
        };
        
    });