'use strict';

describe('Controller: EditRoundCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var EditRoundCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditRoundCtrl = $controller('EditRoundCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
