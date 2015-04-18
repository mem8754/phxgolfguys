'use strict';

describe('Controller: AddTeeTimeCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var AddTeeTimeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddTeeTimeCtrl = $controller('AddTeeTimeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
