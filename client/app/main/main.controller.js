'use strict';

angular.module('phoenixGolfGuysApp').controller('MainCtrl', function ($scope, $http) {
    $scope.upcomingEvents = [];

//    $http.get('/api/things').success(function(awesomeThings) {
//      $scope.awesomeThings = awesomeThings;
//    });
    
    $http.get('/api/events?future=true').success(function (events) {
        $scope.upcomingEvents = events.objSort("dateTime");
    });
    
    $scope.addThing = function () {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
