'use strict';

angular.module('phoenixGolfGuysApp')
  .controller('RegisterCtrl', function ($scope, $stateParams) {
    $scope.message = 'Hello';
    $scope.formModel = {givenName: $stateParams.firstName,
                        surname: $stateParams.lastName,
                        email: $stateParams.email
                       };
  });
