'use strict';

angular.module('phoenixGolfGuysApp')
  .controller('LoginCtrl', function ($scope, $rootScope) {
    $scope.message = 'Hello';
    $rootScope.userAuthorized = false;
    $rootScope.userAuthenticated = false;
  });
