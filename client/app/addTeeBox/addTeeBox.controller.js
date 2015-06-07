/*jslint node: true, nomen: true  */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('AddTeeBoxCtrl', function ($scope, $state, $window, $log, $stateParams, coursesFactory) {
        var courseId = $stateParams.id;
        $scope.tee = {};
        
        function init() {
            $scope.tee.courseId = courseId;
            coursesFactory.getCourse(courseId)
                .error(function (data, status, headers, config) {
                    $window.alert("Server Error " + status + " getting course information.");
                })
                .success(function (course) {
                    $scope.courseTag = course.tag;
                });
        }
   
        init();
        
        /*  post a new Tee Box to the "tees" Factory */
        
        $scope.addTeeBox = function () {

//==========================================================================================
//  Steps to add tee box:
//      1.  Query DB for tee info using provided "courseId"
//      2.  loop through course tees to locate a match on user-provided tee name, quit if found
//      3.  calculate front, back, and total yardages
//      4.  if tee name not found in course info, add this tee box info as a new entry
//==========================================================================================

            coursesFactory.getCourseTees(courseId)              /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $window.alert("Server Error " + status + "loading existing course tees.");
                })
                .success(function (tees) {
                    var i = 0;
                    if (tees !== null) {
                        for (i = 0; i < tees.length; i += 1) {              /*  Step 2 */
                            if (tees[i].teeName === $scope.tee.teeName) {
                                $window.alert("That tee box already exists, please re-enter tee box name");
                                return;
                            }
                        }
                    }

// if we make it here, the tee box name does not exist in the DB for this course, and can be added.

                    $scope.tee.yds[18] = 0;
                    $scope.tee.yds[19] = 0;
                    $scope.tee.yds[20] = 0;        /*  Step 3 */
                    for (i = 0; i < 9; i += 1) {
                        $scope.tee.yds[18] += $scope.tee.yds[i];
                        $scope.tee.yds[19] += $scope.tee.yds[i + 9];
                    }
                    $scope.tee.yds[20] = $scope.tee.yds[18] + $scope.tee.yds[19];
                    $scope.tee.courseId = courseId;

                    coursesFactory.addTee($scope.tee)                /*  Step 4  */
                        .error(function (data, status, headers, config) {
                            $window.alert("Server error " + status + "adding round.");
                        })
                        .success(function (data) {
                            $window.alert("Tee Box successfully added to database.");
                            $state.go('viewCourse', { id: $scope.tee.courseId });
                        });
                });
        };
        
    });