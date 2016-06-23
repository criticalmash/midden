'use strict';

var _ = require('lodash');
var util = require('./lib/util');

module.exports = function midden(data, label){


  return util.templates.main({label:label, data:'some data here'});
};