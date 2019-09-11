"use strict";

const importLazy = require("import-lazy")(require);
const rules = require("./rules");

function requireRuleUnsafe(ruleName) {
  return importLazy(`./rules/${ruleName}`);
}

module.exports = function requireRuleSafe(ruleName) {
  if (rules.includes(ruleName)) {
    return requireRuleUnsafe(ruleName);
  } else {
    return false;
  }
};
module.exports.unsafe = requireRuleUnsafe;
