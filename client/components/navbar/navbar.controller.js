'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.menu = [
            {
                'title': 'Home',
                'link': '/'
            },
            {
                'title': 'Courses',
                'link': '/courses'
            },
            {
                'title': 'Players',
                'link': '/players'
            },
            {
                'title': 'Events',
                'link': '/events'
            }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });