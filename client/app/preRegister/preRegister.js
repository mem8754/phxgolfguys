'use strict';

angular.module('phoenixGolfGuysApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('preRegister', {
        url: '/preRegister',
        templateUrl: 'app/preRegister/preRegister.html',
        controller: 'PreRegisterCtrl'
      });
  });