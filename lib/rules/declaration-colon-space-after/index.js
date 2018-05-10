"use strict";

const declarationColonSpaceChecker = require("../declarationColonSpaceChecker");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const whitespaceChecker = require("../../utils/whitespaceChecker");

const ruleName = "declaration-colon-space-after";

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ":"',
  rejectedAfter: () => 'Unexpected whitespace after ":"',
  expectedAfterSingleLine: () =>
    'Expected single space after ":" with a single-line declaration'
});

const rule = function(expectation, _, context) {
  const checker = whitespaceChecker("space", expectation, messages);
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never", "always-single-line"]
    });
    if (!validOptions) {
      return;
    }

    if (context.fix) {
      var match = /^: /;
      var replaceWithNoSpace = ":";
      var replaceWithSpace = ": ";
      if (expectation == "always" || expectation == "always-single-line") {
        root.walkDecls(decl => {
          decl.raws.between.match(match) == null
            ? (decl.raws.between = replaceWithSpace)
            : (decl.raws.between = replaceWithSpace);
        });
      }
    }

    declarationColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
