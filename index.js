'use strict';

var _ = require('lodash');
var util = require('./lib/util');

module.exports = function midden(data, label, stackConfig){
  var stackInfo = '';
  var lineItems = util.processNested(label, data);
  if(_.isString(stackConfig)){
    stackInfo = stackConfig;
  }else{
    stackInfo = util.stackInfo(stackConfig?stackConfig:3);
  }

  return util.templates.main({data:lineItems, calledFrom: stackInfo});
};