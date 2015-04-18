'use strict';

describe('Controller: ViewCourseCtrl', function () {

  // load the controller's module
  beforeEach(module('phoenixGolfGuysApp'));

  var ViewCourseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewCourseCtrl = $controller('ViewCourseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
