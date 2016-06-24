'use strict';

var _ = require('lodash');
var util = require('./lib/util');

module.exports = function midden(data, label){
  var lineItems = util.processNested(label, data);
  var exports = util.templates.nest({children: lineItems});
  var stackInfo = util.stackInfo(3);
  return util.templates.main({label:label, data:exports, calledFrom: stackInfo});
};