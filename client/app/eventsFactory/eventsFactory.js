/*
'use strict';

angular.module('phoenixGolfGuysApp')
  .factory('eventsFactory', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
*/

/*jslint nomen: true, plusplus: true*/
/*global console, require, process, __dirname, angular*/

(function () {
    'use strict';
    var eventsFactory = function ($http, $log) {
        
        var factory = {};
        
// General EVENT related services (not specific to Tee Times)
        
        factory.getFutureEvents = function (playerId) {
            return $http.get('/api/events?future=true&players=' + playerId);
        };
        
        factory.addEvent = function (event) {
            return $http.post('/api/events', event);
        };
        
        factory.updateEvent = function (event) {
            return $http.put('/api/events/' + event._id, event);
        };
        
        factory.getDuplicateEvent = function (date, type, courseId) {
            var event = {};
            event.date = date;
            event.type = type;
            event.crs = courseId;
            return $http.get('/api/events/find', event);
        };
        
        factory.removeEvent = function (eventId) {
            var method = "DELETE",
                url = '/api/events/' + eventId;
            return $http({ method: method, url: url });
        };
        
// Specific TEE TIME related services
        
        factory.getFutureTeeTimes = function () {
            return $http.get('/api/teeTimes?future=true');
        };
        
        factory.getPastTeeTimes = function () {
            return $http.get('/api/teeTimes?past=true');
        };
        
        factory.getTeeTime = function (teeTimeId) {
            return $http.get('/api/teeTimes/' + teeTimeId);
        };
        

        return factory;
    };
    
    eventsFactory.$inject = ['$http', '$log'];
    
    angular.module('phoenixGolfGuysApp').factory('eventsFactory', eventsFactory);
    
}());