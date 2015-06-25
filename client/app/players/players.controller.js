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
    var PlayersCtrl = function ($scope, $rootScope, $state, $log, $window, playersFactory) {
        $scope.pSortBy = 'lastName';
        $scope.pReverse = false;
        $scope.players = [];
        
        function init() {
            if ($rootScope.userAuthorized) {
                playersFactory.getPlayers()
                    .success(function (players) {
                        $scope.players = players;
                    })
                    .error(function (data, status, headers, config) {
                        $log.warn('Server error getting player documents: ', status);
                    });
            } else {
                $window.alert("\nUser is not authorized to access this web site. (02.02)\n");
                $state.go("main");
            }
        }
        
        function authenticateUser() {

    // Authorize this user if logged in email is found in Players.
            playersFactory.getPlayerByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $window.alert("\nUnable to authenticate user at this time.\n (02.03)");
                    $state.go("main");
                })
                .success(function (player) {
                    $rootScope.userAuthenticated = true;
                    if (player.length === 1) {
                        $rootScope.userAuthorized = true;
                        $rootScope.playerId = player[0]._id;
                        init();
                    } else {
                        $window.alert("\nUser is not authorized to access this web site. (02.01)\n");
                        $state.go("main");
                    }
                });
        }

        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request user authentication with factory.
         } else {
            init();
        }
        
        
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
    
    PlayersCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'playersFactory'];

    angular.module('phoenixGolfGuysApp')
        .controller('PlayersCtrl', PlayersCtrl);
    
}());