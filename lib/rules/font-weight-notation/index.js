"use strict";

const _ = require("lodash");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const isNumbery = require("../../utils/isNumbery");
const isStandardSyntaxValue = require("../../utils/isStandardSyntaxValue");
const isVariable = require("../../utils/isVariable");
const keywordSets = require("../../reference/keywordSets");
const optionsMatches = require("../../utils/optionsMatches");
const postcss = require("postcss");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "font-weight-notation";

const messages = ruleMessages(ruleName, {
  expected: type => `Expected ${type} font-weight notation`,
  invalidNamed: name => `Unexpected invalid font-weight name "${name}"`
});

const INHERIT_KEYWORD = "inherit";
const INITIAL_KEYWORD = "initial";
const NORMAL_KEYWORD = "normal";
const WEIGHTS_WITH_KEYWORD_EQUIVALENTS = ["400", "700"];

const rule = function(expectation, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["numeric", "named-where-possible"]
      },
      {
        actual: options,
        possible: {
          ignore: ["relative"]
        },
        optional: true
      }
    );
    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const propName = decl.prop.toLowerCase();

      if (propName === "font-weight") {
        checkWeight(decl.value, decl);
      }

      if (propName === "font") {
        checkFont(decl);
      }

      if (context.fix) {
        // delete property name
        const declString = decl
          .toString()
          .replace(`${propName}:`, "")
          .trim();

        if (expectation === "named-where-possible") {
          replaceWord(declString, "400", "normal", output => {
            decl.value = output;
          });

          replaceWord(declString, "700", "bold", output => {
            decl.value = output;
          });
        }
        if (expectation === "numeric") {
          replaceWord(declString, "normal", "400", output => {
            decl.value = output;
          });

          replaceWord(declString, "bold", "700", output => {
            decl.value = output;
          });
        }
      }
    });

    function checkFont(decl) {
      const valueList = postcss.list.space(decl.value);
      // We do not need to more carefully distinguish font-weight
      // numbers from unitless line-heights because line-heights in
      // `font` values need to be part of a font-size/line-height pair
      const hasNumericFontWeight = valueList.some(isNumbery);

      for (const value of postcss.list.space(decl.value)) {
        if (
          (value.toLowerCase() === NORMAL_KEYWORD && !hasNumericFontWeight) ||
          isNumbery(value) ||
          (value.toLowerCase() !== NORMAL_KEYWORD &&
            keywordSets.fontWeightKeywords.has(value.toLowerCase()))
        ) {
          checkWeight(value, decl);
          return;
        }
      }
    }

    function checkWeight(weightValue, decl) {
      if (!isStandardSyntaxValue(weightValue)) {
        return;
      }
      if (isVariable(weightValue)) {
        return;
      }
      if (
        weightValue.toLowerCase() === INHERIT_KEYWORD ||
        weightValue.toLowerCase() === INITIAL_KEYWORD
      ) {
        return;
      }

      if (
        optionsMatches(options, "ignore", "relative") &&
        keywordSets.fontWeightRelativeKeywords.has(weightValue.toLowerCase())
      ) {
        return;
      }

      const weightValueOffset = decl.value.indexOf(weightValue);

      if (expectation === "numeric") {
        if (!isNumbery(weightValue)) {
          return complain(messages.expected("numeric"));
        }
      }

      if (expectation === "named-where-possible") {
        if (isNumbery(weightValue)) {
          if (_.includes(WEIGHTS_WITH_KEYWORD_EQUIVALENTS, weightValue)) {
            complain(messages.expected("named"));
          }
          return;
        }
        if (
          !keywordSets.fontWeightKeywords.has(weightValue.toLowerCase()) &&
          weightValue.toLowerCase() !== NORMAL_KEYWORD
        ) {
          return complain(messages.invalidNamed(weightValue));
        }
        return;
      }

      function complain(message) {
        report({
          ruleName,
          result,
          message,
          node: decl,
          index: declarationValueIndex(decl) + weightValueOffset
        });
      }
    }
  };
};

function replaceWord(input, searchString, replaceString, cb) {
  styleSearch({ source: input, target: searchString }, match => {
    if (match.insideParens || match.insideFunctionArguments) {
      // e.g. var(--bold)
      return cb(input);
    }

    const offset = match.startIndex;
    const stringStart = input.slice(0, offset);
    const stringEnd = input.slice(offset + searchString.length);

    cb(`${stringStart}${replaceString}${stringEnd}`);
  });
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
