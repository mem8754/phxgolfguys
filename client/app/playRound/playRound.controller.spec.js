/*jslint node: true, nomen: true */
/*global angular, describe, beforeEach, inject, it, expect */

describe('Controller: PlayRoundCtrl', function () {
    'use strict';

  // load the controller's module
    beforeEach(module('phoenixGolfGuysApp'));

    var ProfileCtrl, scope;

  // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ProfileCtrl = $controller('ProfileCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).toEqual(1);
    });
});
