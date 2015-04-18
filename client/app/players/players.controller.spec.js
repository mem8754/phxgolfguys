'use strict';

describe('Controller: PlayersCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var PlayersCtrl, scope, log;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
