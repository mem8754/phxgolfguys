'use strict';

describe('Controller: PreRegisterCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var PreRegisterCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreRegisterCtrl = $controller('PreRegisterCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
