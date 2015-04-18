'use strict';

describe('Controller: AddRoundCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var AddRoundCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddRoundCtrl = $controller('AddRoundCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
