/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $log, playersFactory) {
    
        function init() {
            playersFactory.getPlayerByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $log.warn('Server error ' + status + ' getting Player data.');
                })
                .success(function (player) {
                    $scope.player = player[0];
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
                    $state.go('main');
                });
        };
    });
