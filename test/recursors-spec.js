'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/
/**
 *  Test functions that process objects and arrays
 */

var chai = require('chai');
var expect = chai.expect;
var assert = require('chai').assert;
var _ = require('lodash');
var jsdom = require("jsdom");

// code to be tested
var util = require('../lib/util');

describe('Midden Recursors', function() {
  it('should exist', function(){
    expect(util.processNested).to.be.a('function', '#processNested() is not a function');
  });

  describe('#processNested() HTML output', function(){
    var arrayName = 'arrname';
    var arrayValue = [1,2,3];
    var arrayHtml = util.processNested('arrname', arrayValue);
    //console.log('arrayHtml', arrayHtml);
    var arrayDom = jsdom.jsdom(arrayHtml);

    it('contains a div.midden-child element', function(){
      var mainEl = arrayDom.querySelector("li.midden-child");
      expect(mainEl.textContent).to.exist;
    });

    it('contains array name (li>div>span)', function(){
      var nameEl = arrayDom.querySelector("li > div > span");
      expect(nameEl.textContent).to.equal(arrayName);
    });

    it('should have div.midden-nest', function(){
      var nestEl = arrayDom.querySelector("div.midden-nest");
      expect(nestEl.textContent).to.exist;
    });

    it('should list array length', function(){
      var emEl = arrayDom.querySelector("div.midden-element em");
      expect(emEl.textContent).to.equal('(Array, ' + arrayValue.length + ' elements)');
    });
  });

  describe('#processNested() Array', function(){
    var arrayName = 'arrname';
    var arrayValue = ['value one', 'value two', 'value 3'];
    var arrayHtml = util.processNested('arrname', arrayValue);
    //console.log('arrayHtml', arrayHtml);
    var arrayDom = jsdom.jsdom(arrayHtml);

    it('should print all values for array', function(){
      // ul > li > div
      var valuesList = arrayDom.querySelectorAll('ul > li > div');
      expect(valuesList.length).equal(arrayValue.length);
    });
  });

  describe('#processNested() Nested Array', function(){
    var arrayName = 'arrname';
    var arrayValue = [[1,2], [3,4], [5,6]];
    var arrayHtml = util.processNested('arrname', arrayValue);
    //console.log('arrayHtml', arrayHtml);
    var arrayDom = jsdom.jsdom(arrayHtml);

    it('should print all values for array', function(){
      // ul > li > div
      var valuesList = arrayDom.querySelectorAll('ul > li > div.midden-element');
      expect(valuesList.length).equal(9);
    });
  });

  describe('#processNested() Object', function(){
    it('should output HTML with object name');
    it('should print all properties for object');
  });

  describe('#processNested() tree', function(){
    it('should output HTML with object name');
    it('should print all properties for object and their children');
  });


});