'use strict';

angular.module('phoenixGolfGuysApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editPlayer', {
        url: '/editPlayer/:id',
        templateUrl: 'app/editPlayer/editPlayer.html',
        controller: 'EditPlayerCtrl'
      });
  });