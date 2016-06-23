'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
var expect = require('chai').expect;

describe('Midden', function() {
    it('should exist', function() {
        expect(require('../')).to.be.defined;
    });

    var midden = require('../');

    describe('midden()', function() {
      it('should return valid HTML', function() {
        var input = {
          label: 'label-text',
          data: {data: 'some data'}
        };
        var actual = midden(input);
        expect(actual).is.a('string');
        });
    });
});