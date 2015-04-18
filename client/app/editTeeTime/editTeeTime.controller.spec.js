'use strict';

describe('Controller: EditTeeTimeCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var EditTeeTimeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditTeeTimeCtrl = $controller('EditTeeTimeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
