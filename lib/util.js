'use strict';

var _ = require('lodash');
var getType = require('get-object-type');

var templates = {
  main: _.template('<div class="midden-root"><ul class="midden-node midden-main"><%= data %></ul> <div class="midden-stack">Called From: <span><%= calledFrom %></span></div></div>'),
  element: _.template('<div class="midden-element"><span><%= label %></span> <em>(<%= type %><%= length %>)</em> <strong><%= contents %></strong></div>'),
  child: _.template('<li class="midden-child<%= classes %>"><%= element %><%= nest %></li>'),
  nest: _.template('<div class="midden-nest"><ul class="midden-node"><%= children %></ul></div>'),
  stack: _.template('<%= path %>:<%= line %>:<%= column %>')
};

/**
 * Crcates a midden element from a variable with a simple data type
 * Tested to work with the following data types:
 *   String
 *   Number
 *   Bool
 *   Null
 *   Undefined
 * but should produce something for any datatype passed
 * @param  {string} label  the name of a property
 * @param  {[type]} prop   a variable
 * @return {strng}         HTML for the midden-element
 */
var processValue = function processValue(label, prop){
  var propType = getType(prop);
  var contents = '';
  var length = '';
  switch(propType){
    case 'String':
      contents = prop;
      length = ', ' + prop.length + ' characters';
      break;
    case 'Number':
      contents = prop.toString();
      break;
    case 'Boolean':
      contents = prop?'True':'False';
      break;
    case 'Array':
      length = ', ' + prop.length + ' elements';
      break;
    case 'Object':
      length = ', ' + _.keys(prop).length + ' properties';
      break;
    default:
      contents = '';
  }
  var templateVars = {
    label:_.isUndefined(label)?'...':label,
    type: propType,
    length: length,
    contents: contents
  };
  return templates.element(templateVars);
};


var processNested = function processNested(label, prop){
  var propType = getType(prop);
  var middenElement = processValue(label, prop);
  var elements = [];
  var middenNest = '';
  var classes = '';
  if(propType==='Array' || propType==='Object'){
    _(prop).forEach(function(value, key){
      //console.log('processNested', {key: key, value: value});
      elements.push(processNested(key, value));
    });
    middenNest = templates.nest({children: elements.join('\n')});
    classes = ' midden-parent';
  }
  
  return templates.child({element: middenElement, nest: middenNest, classes: classes});
};

var stackInfo = function(depth){
  // referenced from https://github.com/baryon/tracer/blob/master/lib/console.js
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
  var stacklist = (new Error()).stack.split('\n');
  var stackLine = stacklist[depth];
  var col = stackReg.exec(stackLine) || stackReg2.exec(stackLine);
  //console.log('stacklist', stacklist);
  var output = templates.stack({path: col[2], line:col[3], column: col[4]});
  
  return output;
};

var util = {
  processValue: processValue,
  processNested: processNested,
  templates: templates,
  stackInfo: stackInfo
};

module.exports = util;



