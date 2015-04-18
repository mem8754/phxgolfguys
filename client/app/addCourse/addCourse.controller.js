/*
'use strict';

angular.module('phoenixGolfGuysApp')
  .controller('AddCourseCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
*/

/*jslint nomen: true, node: true */
/*global angular */

(function () {
    'use strict';
    var AddCourseController = function ($scope, $window, $log, coursesFactory) {
        $scope.course = {};
        
        function init() {
            $log.log("Add Course Controller initialized.");
        }
   
        init();
        
        /*  Add a course through the "courses" Factory */
        
        $scope.addCourse = function () {
            var i = 0,
                course = $scope.course;
            if (course.tag === undefined) {
                $window.alert("Course Tag cannot be blank, please enter a tag.");
                return;
            }
            $log.log('Adding Course', $scope.course.tag);
            
//==========================================================================================
//  Steps to add course:
//      1.  Query DB for user-provided "courseTag" parameter to confirm course does not exist
//      2.  If course is ok to add (does not exist), calculate Front, Back, and Total Par values.
//      3.  Post the new course to the datbase using the data entererd.
//==========================================================================================
            
            coursesFactory.getCourseId(course.tag)
                .error(function (data, status, headers, config) {
                    $log.log("Add Course - error on database read: ", JSON.stringify({data: data}));
                    $window.alert("Error reading database.");
                })
                .success(function (existingCourses) {
                    if (existingCourses.length > 0) {
                        $window.alert("Specified course already exists, please enter a different course name.");
                        return;
                    }
                    
                    course.par[18] = course.par[19] = course.par[20] = 0;
                    for (i = 0; i < 9; i += 1) {
                        course.par[18] += course.par[i];
                        course.par[19] += course.par[i + 9];
                    }
                    course.par[20] = course.par[18] + course.par[19];
                
                    coursesFactory.addCourse(course)
                        .error(function (data, status, headers, config) {
                            $log.log("Add Course - error adding course.", JSON.stringify({data: data}));
                            $window.alert("Server Error - Course not added to database.");
                            return;
                        })
                        .success(function (course) {
                            $window.alert("Course successfully added to database.");
                        });
                });
        };
        
    };

    
    AddCourseController.$inject = ['$scope', '$window', '$log', 'coursesFactory'];

    angular.module('phoenixGolfGuysApp')
        .controller('AddCourseController', AddCourseController);
    
}());