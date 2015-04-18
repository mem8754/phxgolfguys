'use strict';

describe('Controller: EditCourseCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var EditCourseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditCourseCtrl = $controller('EditCourseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
