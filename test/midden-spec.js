'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/
var chai = require('chai');
var expect = chai.expect;
var assert = require('chai').assert;
var _ = require('lodash');
var jsdom = require("jsdom");

// code to be tested
var util = require('../lib/util');

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

    describe('midden() prcoess array', function(){
      var objName = 'testObject';
      var objInstance = {
        'property1': 'a property value',
        'property2': 'another property value',
        'arrayProp': [1,2,3],
        'myMethod' : function(){}
      };
      var objectHtml = midden(objInstance, objName);
      //console.log('objectHtml', objectHtml);
      var objDom = jsdom.jsdom(objectHtml);

      it('should have a .midden-root element', function(){
        var mainEl = objDom.querySelector("div.midden-root");
        expect(mainEl.textContent).to.exist;
      });

      it('should have a variable label', function(){
        var varLabel = objDom.querySelector('.midden-root > .midden-node > .midden-child > .midden-element > span');
        expect(varLabel.textContent).to.equal(objName);
      });

      it('should use default label text when no label is given', function(){
        objectHtml = midden(objInstance);
        //console.log('objectHtml', objectHtml);
        objDom = jsdom.jsdom(objectHtml);
        var varLabel = objDom.querySelector('.midden-root > .midden-node > .midden-child > .midden-element > span');
        expect(varLabel.textContent).to.equal('...');
      });
    });
});