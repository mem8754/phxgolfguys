/*jslint nomen: true, node: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('EditTeeTimeCtrl', function ($scope,
                                            $state,
                                            $stateParams,
                                            $window,
                                            $log,
                                            eventsFactory,
                                            coursesFactory,
                                            playersFactory) {
        var teeTimeId = $stateParams.id;
        
        function init() {
            var i = 0,
                player = {
                    _id: "",
                    name: ""
                };
            $scope.event = {};
            $scope.courses = null;
            $scope.players = null;
            $scope.event.eventType = "Tee Time";
            
            eventsFactory.getTeeTime(teeTimeId)
                .error(function (data, status, headers, config) {
                    $log.warn("Server error " + status + " reading Event info (Edit Tee Time).");
                })
                .success(function (event) {
                    $scope.event = event;
                    $scope.dt = new Date($scope.event.dateTime);
                    coursesFactory.getCourses()
                        .error(function (data, status, headers, config) {
                            $log.warn("Server error " + status + " reading course info (Edit Tee Time).");
                        })
                        .success(function (courses) {
                            $scope.courses = courses.objSort("state", "tag");

                            playersFactory.getPlayerNames()
                                .error(function (data, status, headers, config) {
                                    $log.warn("Edit Tee Time - server error reading player info: ", status);
                                })
                                .success(function (players) {
                                    var i = 0;
                                    for (i = 0; i < players.length; i += 1) {
                                        players[i].lastName = players[i].lastName + ", " + players[i].firstName;
                                    }
                                    $scope.players = players.objSort("lastName");
                                });
                        });
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateTeeTime = function () {

//  Procedure to update tee time record with revised user input. Called by HTML update dialog directly.
            
            if ($scope.event.players.length > 4) {
                $window.alert("\nToo many players selected, max four allowed.\n" +
                              "Remove players from the list and re-submit.\n");
                return;
            }
            $scope.event.dateTime = $scope.dt.toISOString();
            eventsFactory.updateEvent($scope.event)
                .error(function (data, status, headers, config) {
                    $window.alert("Server error " + status + " adding tee time.");
                })
                .success(function (data) {
                    $window.alert("Tee Time event successfully updated in database.");
                    $state.go('events');
                });
        };
        
    });