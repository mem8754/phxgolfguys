'use strict';

describe('Controller: AddCourseCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var AddCourseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddCourseCtrl = $controller('AddCourseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
