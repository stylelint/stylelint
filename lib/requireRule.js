"use strict";

const importLazy = require("import-lazy")(require);
const rules = require("./rules");

module.exports = function(ruleName) {
  if (rules.indexOf(ruleName) !== -1) {
    return importLazy(`./rules/${ruleName}`);
  } else {
    return false;
  }
};
