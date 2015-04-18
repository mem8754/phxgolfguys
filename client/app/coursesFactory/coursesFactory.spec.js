'use strict';

describe('Service: coursesFactory', function () {

  // load the service's module
  beforeEach(module('phoenixGolfGuysApp'));

  // instantiate service
  var coursesFactory;
  beforeEach(inject(function (_coursesFactory_) {
    coursesFactory = _coursesFactory_;
  }));

  it('should do something', function () {
    expect(!!coursesFactory).toBe(true);
  });

});
