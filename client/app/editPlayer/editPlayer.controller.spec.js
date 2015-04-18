'use strict';

describe('Controller: EditPlayerCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var EditPlayerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditPlayerCtrl = $controller('EditPlayerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
