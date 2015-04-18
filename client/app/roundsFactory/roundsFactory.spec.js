'use strict';

describe('Service: roundsFactory', function () {

  // load the service's module
  beforeEach(module('phoenixGolfGuysApp'));

  // instantiate service
  var roundsFactory;
  beforeEach(inject(function (_roundsFactory_) {
    roundsFactory = _roundsFactory_;
  }));

  it('should do something', function () {
    expect(!!roundsFactory).toBe(true);
  });

});
