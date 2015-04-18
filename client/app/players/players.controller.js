/* 
'use strict';

angular.module('phoenixGolfGuysApp')
  .controller('PlayersCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
*/

/*global angular */

/*jslint nomen: true, node: true */
/*global angular */

(function () {
    'use strict';
    var PlayersCtrl = function ($scope, $log, playersFactory) {
        $scope.pSortBy = 'lastName';
        $scope.pReverse = false;
        $scope.players = [];
        
        function init() {
            playersFactory.getPlayers()
                .success(function (players) {
                    $scope.players = players;
                })
                .error(function (data, status, headers, config) {
                    $log.warn('Server error getting player documents: ', status);
                    $log.warn('Data: ', data);
                });
        }
        
        init();
        
        $scope.doSort = function (propName) {
            console.log('Player Sort: ' + propName + '; ' + $scope.pReverse);
            if (propName === $scope.pSortBy) {
                $scope.pReverse = !$scope.pReverse;
            } else {
                $scope.pReverse = false;
                $scope.pSortBy = propName;
            }
        };
    };
    
    PlayersCtrl.$inject = ['$scope', '$log', 'playersFactory'];

    angular.module('phoenixGolfGuysApp')
        .controller('PlayersCtrl', PlayersCtrl);
    
}());