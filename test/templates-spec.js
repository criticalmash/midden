'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
var expect = require('chai').expect;

describe('Midden Utilities', function() {
    it('should exist', function() {
        expect(require('../lib/util')).to.be.defined;
    });

    var util = require('../lib/util');

    describe('templates main', function() {
      it('should return valid HTML', function() {
        var input = {
          label: 'label-text',
          data: {data: 'some data'}
        };
        var actual = util.templates.main(input);
        expect(actual).is.a('string');
        });
    });
});