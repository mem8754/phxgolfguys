/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('phoenixGolfGuysApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'stormpath',
    'stormpath.templates',
    'ui.bootstrap'
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
    })
    .run(function ($stormpath) {
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'main'
        });
    });