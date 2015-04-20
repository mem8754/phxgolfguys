/*jslint node: true, nomen: true */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EditPlayerCtrl', function ($scope, $state, $stateParams, $window, $log, playersFactory) {
        var playerId = $stateParams.id;
        $scope.player = null;
        
        
        function init() {
            playersFactory.getPlayer(playerId)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error ' + status + ' getting Player data.');
                })
                .success(function (player) {
                    $scope.player = player;
                });
        }
        
        init();
        
        $scope.updatePlayer = function () {
            playersFactory.updatePlayer($scope.player)
                .error(function (data, status, headers, config) {
                    $window.alert("Server error " + status + " updating Player profile.");
                })
                .success(function (data) {
                    $window.alert("\nPlayer profile successfully updated.\n");
                    $state.go('viewPlayer', { id: $scope.player._id });
                });
        };
    });