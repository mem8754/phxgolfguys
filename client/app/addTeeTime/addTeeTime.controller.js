/*jslint node: true, nomen: true */
/*global angular */

'use strict';

angular.module('phoenixGolfGuysApp')
    .controller('AddTeeTimeCtrl', function ($scope,
                                            $state,
                                            $window,
                                            $log,
                                            eventsFactory,
                                            coursesFactory,
                                            playersFactory) {

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
            
            coursesFactory.getCourses()
                .error(function (data, status, headers, config) {
                    $log.warn("Add Tee Time - server error reading course info: ", status);
                })
                .success(function (courses) {
                    $scope.courses = courses.objSort("state", "tag");

                    playersFactory.getPlayerNames()
                        .error(function (data, status, headers, config) {
                            $log.warn("Add Tee Time - server error reading player info: ", status);
                        })
                        .success(function (players) {
                            var i = 0;
                            for (i = 0; i < players.length; i += 1) {
                                players[i].lastName = players[i].lastName + ", " + players[i].firstName;
                            }
                            $scope.players = players.objSort("lastName");
                        });
                });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.addTeeTime = function () {
            var i = 0;
            eventsFactory.addEvent($scope.event)
                .error(function (data, status, headers, config) {
                    $window.alert("Server error " + status + " adding tee time.");
                })
                .success(function (data) {
                    $window.alert("Tee Time event successfully added to database.");
                    $state.go('events');
                });
        };
        
    });