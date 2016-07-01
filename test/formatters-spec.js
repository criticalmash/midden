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

describe('Midden Formaters', function() {
    it('should exist', function() {
        expect(util.processValue).to.be.a('function', '#processValue() is not a function');
        //assert.isFunction(util.processArray, '#processArray() is not a function');
    });

    describe('#processValue() valid markup', function(){
      it('should have valid markup', function(){
        var stringValue = 'A string value';
        var stringDom = jsdom.jsdom(util.processValue('varname', stringValue));
        var strongEl = stringDom.querySelector("strong");
        //console.log('contents', strongEl.textContent);
        expect(strongEl.textContent).to.equal(stringValue);
      });
    });

    describe('#processValue() String', function() {
      it('should accept a key:string and return proper HTML', function() {
        var testCases = [
          {key: 'variable-name', value: 'A certain string'},
          {key: 'varname', value: 'Another random string'},
          {key: 'hey', value: '<div>Even more Content wrapped up pretty</div>'}
        ];

        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc.value);
          expect(actual).to.contain(tc.key, 'missing variable name');
          expect(actual).to.contain(tc.value, 'missing value');
          expect(actual).to.contain(tc.value.length.toString() + " characters", "missing character count");
        });
        
      });
    });

    describe('#processValue() Long String', function() {
      var longString = "This is the begining of a very long string. It just goes on and one and on. It could go on for several paragraphs if we want it to. But this should be long enough.";
      var actualHtml = util.processNested('longString', longString);
      //console.log('processValue() Long String', actualHtml);
      var actualDom = jsdom.jsdom(actualHtml);

      it('should accept a long string and present an abbreviated preview', function(){
        var strongEl = actualDom.querySelector('.midden-element strong');
        expect(strongEl.textContent.length).to.be.below(64);
      });

      it('should have elipsis at the end of the preview', function(){
        var strongEl = actualDom.querySelector('.midden-element strong');
        expect(strongEl.textContent.slice(-1)).to.equal('…');
      });

      it('should place the whole string in a child element', function(){
        var childEl = actualDom.querySelector('div.midden-node');
        expect(childEl.textContent).to.contain(longString);
      });
    });

    describe('#processValue() Number', function() {
      it('should accept a key:number and return proper HTML', function(){
        var lable = 'number name';
        var value = 200;
        var testCases = [
          {key: 'number-name', value: 200},
          {key: 'varname', value: -1000},
          {key: 'hey', value: 0}
        ];
        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc.value);
          expect(actual).to.contain(tc.key, 'missing variable name');
          expect(actual).to.contain(tc.value, 'missing value');
          expect(actual).to.contain("Number", "missing value type");
        });
      });
    });

    describe('#processValue() Bool', function() {
      it('should accept a key:Boolean and return proper HTML', function(){
        var testCases = [
          {key: 'booleanTrue', value: true},
          {key: 'booleanFalse', value: false}
        ];
        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc.value);
          expect(actual).to.contain(tc.key, 'missing variable name');
          expect(actual.toLowerCase()).to.contain(tc.value, 'missing value');
          expect(actual).to.contain("Boolean", "missing value type");
        });
      });
    });

    describe('#processValue Null', function() {
      it('should accept a key:Null and return proper HTML', function(){
        var testCases = [
          {key: 'aNullValue', value: null}
        ];
        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc.value);
          expect(actual).to.contain(tc.key, 'missing variable name');
          expect(actual).to.contain('Null', 'missing value');
          expect(actual).to.contain("Null", "missing value type");
        });
      });
    });

    describe('#processValue Undefined', function() {
      it('should accept a key:Undefined and return proper HTML', function(){
        var testCases = [
          {key: 'aNullValue', value: undefined}
        ];
        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc.value);
          expect(actual).to.contain(tc.key, 'missing variable name');
          expect(actual).to.contain('Undefined', 'missing value');
          expect(actual).to.contain("Undefined", "missing value type");
        });
      });
    });

    describe('#processValue Array', function() {
      it('should accept a key:array and return proper HTML', function() {
        var testCases = [
          {key: 'array-name', value: ['An array item']},
          {key: 'arrname', value: ['First array item','Another array item']},
          {key: 'hi', value: [1,2,3]}
        ];
        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc.value);
          expect(actual).to.contain(tc.key, 'missing variable name');
          //expect(actual).to.contain(tc.value.join(), 'missing value');
          expect(actual).to.contain("Array", "missing value type");
        });
      });
    });

    describe('#processValue Object', function() {
      it('should accept a key:array and return proper HTML', function() {
        var testCases = [
          {key: 'array-name', value: ['An array item']},
          {key: 'arrname', value: ['First array item','Another array item']},
          {key: 'hi', value: [1,2,3]}
        ];
        testCases.forEach(function (tc) {
          var actual = util.processValue(tc.key, tc);
          expect(actual).to.contain(tc.key, 'missing variable name');
          //expect(actual).to.contain('[object Object]', 'missing value');
          expect(actual).to.contain("Object", "missing value type");
        });
      });
    });

    describe('#processValue Function', function() {
      it('should accept a key:array and return proper HTML', function() {
        var testCases = {
          method1: function(){},
          method2: function(){
            this.subRoutine = function(){};
          }
        };
        _.forEach(testCases, function (methodFunction, methodName) {
          var actual = util.processValue(methodName, methodFunction);
          expect(actual).to.contain(methodName, 'missing variable name');
          // expect(actual).to.contain('[object Object]', 'missing value');
          expect(actual).to.contain("Function", "missing value type");
        });
      });
    });
});