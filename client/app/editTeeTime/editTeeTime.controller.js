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
        
        $scope.removeTeeTime = function (teeTimeId) {

// Procedure to remove an Event (tee time event, in this case):
//      1.  query the database for the event ID to be removed.
//      2.  prompt the user for confirmation on the removal.
//      3.  call the Events factory to process the removal.
//      4.  confirm that the event has been removed by attempting to query again

            
            eventsFactory.getTeeTime(teeTimeId)                                                          /*  Step 1  */
                .error(function (data, status, headers, config) {
                    $window.alert("Server error " + status + " retrieving Tee Time event.");
                })
                .success(function (event) {
                    var userResp = $window.confirm("Remove " + event.eventType + "Event for " + event.dateTime + "?");
                    if (userResp) {                                                                     /*  Step 2  */
                        eventsFactory.removeEvent(event._id)                                            /*  Step 3  */
                            .error(function (data, status, headers, config) {
                                $window.alert("Server error " + status + " removing Tee Time event.");
                            })
                            .success(function (data) {
                                eventsFactory.getTeeTime(event._id)                                     /*  Step 4  */
                                    .error(function (data, status, headers, config) {
                                        if (status === 404) {
                                            $window.alert("\nTee Time event successfully removed.\n");
                                            $state.go('events');
                                        } else {
                                            $window.alert("\nServer error " + status + " removing Tee Time, not removed.\n");
                                        }
                                    })
                                    .success(function (event) {
                                        if (null !== event) {
                                            $window.alert("\nEvent not removed from database.\n");
                                        } else {
                                            $window.alert("\nTee Time Event successfully removed.\n");
                                            $scope.go('events');
                                        }
                                    });
                                
                            });
                    }
                });
        };
        
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