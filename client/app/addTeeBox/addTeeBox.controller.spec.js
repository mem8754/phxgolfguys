'use strict';

describe('Controller: AddTeeBoxCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var AddTeeBoxCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddTeeBoxCtrl = $controller('AddTeeBoxCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
