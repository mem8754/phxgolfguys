/*jslint node: true, nomen: true  */
/*global beforeEach, module, describe, inject, expect, it  */

'use strict';

describe('Service: playersFactory', function () {

// load the service's module
    beforeEach(module('phoenixGolfGuysApp'));

// instantiate service
    var playersFactory;
    beforeEach(inject(function (_playersFactory_) {
        playersFactory = _playersFactory_;
    }));

    it('should do something', function () {
        expect(!!playersFactory).toBe(true);
    });

});
