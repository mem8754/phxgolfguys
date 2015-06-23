/*
'use strict';

angular.module('phoenixGolfGuysApp')
  .factory('roundsFactory', function () {
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
    var roundsFactory = function ($http, $log) {

        var factory = {},
            rounds = null;
            
//========================================================================================================
//  calcHdcpDiff Function
//      This function will calculate round scores based on a player's handicap index, slope rating, and
//          hole par scores.
//      It requires an array of Gross scores (21 values), a handicap index, and an array of "par" values 
//          for course holes (low handicap player hole maxima are based on hole par).
    
//      The function returns an object consisting of adjusted Gross scores (21 values, including adjusted 
//          scores for each of the 18 holes, plus totals for front nine, back nine, and course) and 
//          updated Gross score totals (in array elements 18-20).
//========================================================================================================
    
        function calcHdcpDiff(gross, crsHcp, par) {
            var whichNine = 0,
                i = 0,
                j = 0,
                maxScore = 0,
                scores = {
                    grossScore: [],
                    adjGrossScore: []
                };

            scores.grossScore = gross;

            for (i = 18; i < 21; i += 1) {
                scores.grossScore[i] = 0;
                scores.adjGrossScore[i] = 0;
            }

//========================================================================================================
//  Calculate hole max based on cours handicap. Low hcp max will be calculated by hole based on par.
//========================================================================================================

            if (crsHcp >= 40) {
                maxScore = 10;
            } else if (crsHcp >= 30) {
                maxScore = 9;
            } else if (crsHcp >= 20) {
                maxScore = 8;
            } else if (crsHcp >= 10) {
                maxScore = 7;
            }


//========================================================================================================
//  Calculate values for Front Nine, then for Back Nine.
//========================================================================================================

            for (whichNine = 0; whichNine < 2; whichNine += 1) {    /*  process each nine in a separate pass */
                j = whichNine * 9;

//========================================================================================================
//  Calculate adjusted scores for each hole on the current "Nine".
//========================================================================================================

                for (i = 0; i < 9; i += 1) {
                    if (crsHcp < 10) {
                        maxScore = par[i] + 2;              /*  calculate low handicap max score  */
                    }
                    scores.adjGrossScore[i + j] = Math.min(scores.grossScore[i + j], maxScore);

//========================================================================================================
//  Calculate total gross and adj gross scores for current "Nine" [18]/[19] and overall round [20].
//========================================================================================================

                    scores.grossScore[18 + whichNine] += scores.grossScore[i + j];
                    scores.adjGrossScore[18 + whichNine] += scores.adjGrossScore[i + j];
                    scores.grossScore[20] += scores.grossScore[i + j];
                    scores.adjGrossScore[20] += scores.adjGrossScore[i + j];
                }
            }

            return (scores);
        }

//========================================================================================================
//  Requests related to rounds (rounds that have been completed / posted.
//========================================================================================================
        
        factory.getRounds = function () {
            return $http.get('/api/rounds');
        };
        
        factory.getPlayerRounds = function (id) {
            return $http.get('/api/rounds?playerId=' + id);
        };
        
        factory.getCourseRounds = function (id) {
            return $http.get('/api/rounds?courseId=' + id);
        };
        
        factory.getTeeBoxRounds = function (id) {
            return $http.get('/api/rounds?teeId=' + id);
        };
        
        factory.getRound = function (roundId) {
            return $http.get('/api/rounds/' + roundId);
        };
 
        factory.removeRound = function (roundId) {
            var method = "DELETE",
                url = '/api/rounds/' + roundId;
            return $http({ method: method, url: url });
        };
        
        factory.saveRound = function (round) {
            return $http.put('/api/rounds/' + round._id, round);
        };

        factory.updateRound = function (round, hdcp) {
            var scores = {};
            $log.log('roundsFactory updateRound: ', round);
            $log.log('Hdcp Data: ', hdcp);
            
            round.crsHdcp = Math.round(round.hdcpIndex * hdcp.slopeRating / 113.0);
            
            scores = calcHdcpDiff(round.grossScore, round.crsHdcp, hdcp.par);
            
            round.grossScore = scores.grossScore;
            round.adjGrossScore = scores.adjGrossScore;
            
            round.hdcpDiff = (round.adjGrossScore[20] - hdcp.courseRating) * 113.0 / hdcp.slopeRating;
            round.hdcpDiff = Math.round(round.hdcpDiff * 10) / 10;
            
            round.netScore = scores.grossScore[20] - round.crsHdcp;
            
            $log.log('Updated Round: ', round);
            
            return $http.put('/api/rounds/' + round._id, round);
        };
        
        factory.addRound = function (round) {
            $log.log('roundsFactory addRound: ', round);
            return $http.post('/api/rounds', round);
        };
        
//-----------------------------------------------------------------------------------------
// Requests related to Active Rounds (rounds being played / scored).
//-----------------------------------------------------------------------------------------
        
        factory.getActiveRounds = function () {
            return $http.get('/api/activeRounds');
        };
        
        factory.getPlayerActiveRounds = function (id) {
            return $http.get('/api/activeRounds?playerId=' + id);
        };
        
        factory.getActiveRound = function (roundId) {
            return $http.get('/api/activeRounds/' + roundId);
        };
 
        factory.removeActiveRound = function (roundId) {
            var method = "DELETE",
                url = '/api/activeRounds/' + roundId;
            return $http({ method: method, url: url });
        };
        
        factory.saveActiveRound = function (round) {
            return $http.put('/api/activeRounds/' + round._id, round);
        };
         
        factory.updateActiveRound = function (round) {
            return $http.put('/api/activeRounds/' + round._id, round);
        };
        
        factory.addActiveRound = function (round) {
            return $http.post('/api/activeRounds', round);
        };
        
//-----------------------------------------------------------------------------------------
// End of Factory functions
//-----------------------------------------------------------------------------------------
        
        return factory;

    };

    roundsFactory.$inject = ['$http', '$log'];

    angular.module('phoenixGolfGuysApp').factory('roundsFactory', roundsFactory);

}());