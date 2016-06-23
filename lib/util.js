'use strict';

var _ = require('lodash');
var getType = require('get-object-type');

var templates = {
  main: _.template('<div class="midden-wrapper"><p><%= label %></p> <%= data %></div>'),
  element: _.template('<div class="midden-element"><span><%= label %></span> <em>(<%= type %><%= length %>)</em><strong><%= contents %></strong></div>'),
  child: _.template('<li class="midden-child"><%= element %><%= nest %></li>'),
  nest: _.template('<div class="midden-nest"><ul class="midden-node"><%= children %></ul></div>')
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
    default:
      contents = '';
  }
  var templateVars = {
    label:label,
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
  if(propType==='Array'){
    _(prop).forEach(function(value, key){
      //console.log('processNested', {key: key, value: value});
      elements.push(processNested(key, value));
    });
    middenNest = templates.nest({children: elements.join('\n')});
  }
  
  return templates.child({element: middenElement, nest: middenNest});
};

var util = {
  processValue: processValue,
  processNested: processNested
};

module.exports = util;



