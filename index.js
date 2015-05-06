"use strict";

var postcss = require("postcss");
var rules = require("./lib/rules");

module.exports = postcss.plugin("stylelint", function(opts) {
  return function(css, result) {
    for (var rule in opts) {
      if (opts.hasOwnProperty(rule)) {
        rules[rule](opts[rule])(css, result);
      }
    }
  };
});
