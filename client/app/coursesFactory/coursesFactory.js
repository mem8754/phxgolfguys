/*
'use strict';

angular.module('phoenixGolfGuysApp')
  .factory('coursesFactory', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
*/
/*jslint node: true, nomen: true  */
/*global angular */

(function () {
    'use strict';
    var coursesFactory = function ($http, $log) {
        
        var factory = {};
        
//  COURSE related requests / routes
            
        factory.getCourses = function () {
            return $http.get('/api/courses');
        };
        
        factory.getCourseNames = function () {
            return $http.get('/api/courses');
        };
        
        factory.getCourse = function (courseId) {
            return $http.get('/api/courses/' + courseId);
        };
        
        factory.getCourseId = function (courseTag) {
            return $http.get('/api/courses/by/tag/' + courseTag);
        };

        factory.getCourseHdcp = function (courseId) {
            return $http.get('/api/courses/' + courseId);
        };
        
        factory.addCourse = function (course) {
            return $http.post('/api/courses', course);
        };
        
        factory.updateCourse = function (course) {
            return $http.put('/api/courses/' + course._id, course);
        };
        
        
// TEE related requests / routes        
        
        factory.getTee = function (teeId) {
            return $http.get('/api/tees/' + teeId);
        };
        
        factory.getCourseTees = function (id) {
            return $http.get('/api/tees?courseId=' + id);
        };
        
        factory.addTee = function (tee) {
            return $http.post('/api/tees', tee);
        };
        
        factory.updateTee = function (tee) {
            return $http.put('/api/tees/' + tee._id, tee);
        };

        factory.removeTeeBox = function (teeId) {
            var method = "DELETE",
                url = '/api/tees/' + teeId;
            return $http({ method: method, url: url });
        };
        
        return factory;
    };
    
    coursesFactory.$inject = ['$http', '$log'];
    
    angular.module('phoenixGolfGuysApp').factory('coursesFactory', coursesFactory);
    
}());