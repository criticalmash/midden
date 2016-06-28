'use strict';

var _ = require('lodash');
var util = require('./lib/util');

module.exports = function midden(data, label, depth){
  var lineItems = util.processNested(label, data);
  var stackInfo = util.stackInfo(depth?depth:3);
  return util.templates.main({data:lineItems, calledFrom: stackInfo});
};