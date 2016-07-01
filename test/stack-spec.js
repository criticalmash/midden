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

describe('Midden stack output', function() {
    var midden = require('../');

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

      it('should mention file:line it was called from', function(){
        var stackInfo = 'midden/test/stack-spec.js:25'; // Note: update with current filename:line
        var stackEl = objDom.querySelector('.midden-stack');
        expect(stackEl.textContent).to.contain(stackInfo, 'check test to make sure line hasn\'t changed');
      });

    });

    describe('midden stack depth variable', function(){
      var objName = 'testObject';
      var objInstance = {
        'property1': 'a property value',
        'property2': 'another property value',
        'arrayProp': [1,2,3],
        'myMethod' : function(){}
      };

      it('should be editable', function(){
        var objectHtml = midden(objInstance, objName, 2);
        var objDom = jsdom.jsdom(objectHtml);
        var stackInfo = 'index.js:12'; // Note: update with current filename:line
        var stackEl = objDom.querySelector('.midden-stack');
        expect(stackEl.textContent).to.contain(stackInfo, 'check midden/index.js to make sure line hasn\'t changed');
      });
    });

    describe('midden stack output alternate text', function(){
      var objName = 'testObject';
      var objInstance = {
        'property1': 'a property value'
      };

      it('should accept a string and use it in place of its own calculation', function(){
        var altPath = '/src/content/about.hbs:2';
        var objectHtml = midden(objInstance, objName, altPath);
        //console.log('stack alternate', objectHtml);
        var objDom = jsdom.jsdom(objectHtml);
        var stackEl = objDom.querySelector('.midden-stack');
        expect(stackEl.textContent).to.contain(altPath);
      });
    });
});









