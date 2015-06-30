/*jslint nomen: true, node: true plusplus: true */
/*global angular */

angular.module('phoenixGolfGuysApp').controller('MainCtrl', function ($scope, $http) {
    'use strict';
    $scope.upcomingEvents = [];
    $scope.eventsFound = false;

//    $http.get('/api/things').success(function(awesomeThings) {
//      $scope.awesomeThings = awesomeThings;
//    });
    
    $http.get('/api/events?future=true').success(function (events) {
        $scope.upcomingEvents = events.objSort("dateTime");
        $http.get('/api/courses').success(function (courses) {
            var i, j;
            for (i = 0; i < $scope.upcomingEvents.length; i++) {
                $scope.eventsFound = true;
                for (j = 0; j < courses.length; j++) {
                    if ($scope.upcomingEvents[i].courseId === courses[j]._id) {
                        $scope.upcomingEvents[i].loc = courses[j].tag;
                        break;
                    }
                }
            }
        });
    });
 
    /*
    $scope.addThing = function () {
        if ($scope.newThing === '') {
            return;
        }
        $http.post('/api/things', { name: $scope.newThing });
        $scope.newThing = '';
    };

    $scope.deleteThing = function (thing) {
        $http.delete('/api/things/' + thing._id);
    };
    */
});
