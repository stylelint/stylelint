"use strict";

var postcss = require("postcss");

module.exports = function testRule(rule) {
  return function(cssString, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = null;
    }
    postcss()
      .use(rule(options))
      .process(cssString)
      .then(function(result) {
        callback(result.warnings());
      });
  };
  // againstFixture could be a method attached to this ...
};
