'use strict';

describe('Controller: ViewPlayerCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var ViewPlayerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewPlayerCtrl = $controller('ViewPlayerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
