/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('PreRegisterCtrl', function ($scope, $state, $stateParams, $window, $log, playersFactory) {
        
// Procedure to pre-register a new player:
//      1.  check for invalid input fields.
//      2.  query database for pending requests under this email ID, quit if found.
//      3.  query database for existing player under this email id, quit if found.
//      4.  call the Players factory to post the new player.

        $scope.reqRegistration = function () {              /*  Handle request for a New Player  */
            
            // Step 1. Validate the provided data.
            
            var msg = "\n",
                errors = false;

            if ($scope.request.lastName === "") {
                msg = msg + "Last Name field cannot be empty.\n";
                errors = true;
            }
            if ($scope.request.firstName === "") {
                msg = msg + "First Name field cannot be empty.\n";
                errors = true;
            }
            if ($scope.request.email === "") {
                msg = msg + "Email ID field cannot be empty.\n";
                errors = true;
            }
            if (errors) {
                $window.alert(msg + "Please correct errors and re-submit.");
                return;
            }

            //  Step 2. Check for pending requests.
            
            playersFactory.getRequests($scope.request.email)
                .error(function (data, status) {
                    $log.log("\nServer Error " + status + " querying Requests, registration not posted.\n");
                    $state.go('main');
                })
                .success(function (data) {
                    if (data.length > 0) {
                        $window.alert("\nRequest being processed.\n");
                        $state.go('main');
                        return;
                    }
                
                    //  Step 3.  Check for existing players using this email.

                    playersFactory.getPlayerByEmail($scope.request.email)                   /*  Step 1  */
                        .error(function (data, status) {
                            $log.log("\nServer Error " + status + " querying players, request not posted.\n");
                            $state.go('main');
                        })
                        .success(function (data) {
                            if (data.length > 0) {
                                $window.alert("\nEmail already provisioned.\n");
                                $state.go('main');
                                return;
                            }
                        
                            //  Step 4.  Add the request to the queue.

                            playersFactory.addRequest($scope.request)
                                .error(function (data, status) {
                                    $log.log("\nServer error " + status + " posting request, not posted.\n");
                                    $state.go('main');               /*  Back to ViewPlayers  */
                                })
                                .success(function (data) {
                                    $window.alert("\nNew Player request successfully posted.\n");
                                    $state.go('main');
                                });

                        });
                });

        };
        
        function init() {
            $scope.request = {};
            $scope.request.firstName = "";
            $scope.request.lastName = "";
            $scope.request.email = "";
            $scope.request.phone = "";
            $scope.request.hdcp = 99.9;
            $scope.request.ghinNo = "";
        
        }
        
        init();

    });