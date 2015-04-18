'use strict';

describe('Controller: EditTeeBoxCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var EditTeeBoxCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditTeeBoxCtrl = $controller('EditTeeBoxCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
