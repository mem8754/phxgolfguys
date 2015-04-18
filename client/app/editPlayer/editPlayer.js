'use strict';

angular.module('phoenixGolfGuysApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editPlayer', {
        url: '/editPlayer',
        templateUrl: 'app/editPlayer/editPlayer.html',
        controller: 'EditPlayerCtrl'
      });
  });