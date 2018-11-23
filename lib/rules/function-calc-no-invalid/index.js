"use strict";

const _ = require("lodash");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const parseCalcExpression = require("../../utils/parseCalcExpression");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const valueParser = require("postcss-value-parser");

const ruleName = "function-calc-no-invalid";

const messages = ruleMessages(ruleName, {
  expectedExpression: () => "Expected a valid expression",
  expectedSpaceBeforeOperator: operator =>
    `Expected space before "${operator}" operator`,
  expectedSpaceAfterOperator: operator =>
    `Expected space after "${operator}" operator`,
  rejectedDivisionByZero: () => "Unexpected division by zero",
  expectedValidResolvedType: operator =>
    `Expected to be compatible with the left and right argument types of "${operator}" operation.`
});

const rule = function(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        if (node.type !== "function" || node.value.toLowerCase() !== "calc") {
          return;
        }

        let ast;

        try {
          ast = parseCalcExpression(valueParser.stringify(node));
        } catch (e) {
          if (e.hash && e.hash.loc) {
            complain(
              messages.expectedExpression(),
              node.sourceIndex + e.hash.loc.range[0]
            );

            return;
          } else {
            throw e;
          }
        }

        verifyMathExpressions(ast, node);
      });

      function complain(message, valueIndex) {
        report({
          message,
          node: decl,
          index: declarationValueIndex(decl) + valueIndex,
          result,
          ruleName
        });
      }

      /**
       * Verify that each operation expression is valid.
       * Reports when a invalid operation expression is found.
       * @param {object} expression expression node.
       * @param {object} node calc function node.
       * @returns {void}
       */
      function verifyMathExpressions(expression, node) {
        if (expression.type === "MathExpression") {
          const { operator, left, right } = expression;

          if (operator === "+" || operator === "-") {
            if (
              expression.source.operator.end.index === right.source.start.index
            ) {
              complain(
                messages.expectedSpaceAfterOperator(operator),
                node.sourceIndex + expression.source.operator.end.index
              );
            }

            if (
              expression.source.operator.start.index === left.source.end.index
            ) {
              complain(
                messages.expectedSpaceBeforeOperator(operator),
                node.sourceIndex + expression.source.operator.start.index
              );
            }
          } else if (operator === "/") {
            if (
              (right.type === "Value" && right.value === 0) ||
              (right.type === "MathExpression" && getNumber(right) === 0)
            ) {
              complain(
                messages.rejectedDivisionByZero(),
                node.sourceIndex + expression.source.operator.end.index
              );
            }
          }

          if (getResolvedType(expression) === "invalid") {
            complain(
              messages.expectedValidResolvedType(operator),
              node.sourceIndex + expression.source.operator.start.index
            );
          }

          verifyMathExpressions(expression.left, node);
          verifyMathExpressions(expression.right, node);
        }
      }
    });
  };
};

function getNumber(mathExpression) {
  const { left, right } = mathExpression;

  const leftValue =
    left.type === "Value"
      ? left.value
      : left.type === "MathExpression"
      ? getNumber(left)
      : null;
  const rightValue =
    right.type === "Value"
      ? right.value
      : right.type === "MathExpression"
      ? getNumber(right)
      : null;

  if (_.isNil(leftValue) || _.isNil(rightValue)) {
    return null;
  }

  switch (mathExpression.operator) {
    case "+":
      return leftValue + rightValue;
    case "-":
      return leftValue - rightValue;
    case "*":
      return leftValue * rightValue;
    case "/":
      return leftValue / rightValue;
  }

  return null;
}

function getResolvedType(mathExpression) {
  const {
    left: leftExpression,
    operator,
    right: rightExpression
  } = mathExpression;
  const left =
    leftExpression.type === "MathExpression"
      ? getResolvedType(leftExpression)
      : leftExpression.type;
  const right =
    rightExpression.type === "MathExpression"
      ? getResolvedType(rightExpression)
      : rightExpression.type;

  if (
    left === "UnknownValue" ||
    right === "UnknownValue" ||
    left === "Function" ||
    right === "Function" ||
    left === "invalid" ||
    right === "invalid"
  ) {
    return "UnknownValue";
  }

  switch (operator) {
    case "+":
    case "-":
      if (left === right) {
        return left;
      }

      if (left === "Value" || right === "Value") {
        return "invalid";
      }

      if (left === "PercentageValue") {
        return right;
      }

      if (right === "PercentageValue") {
        return left;
      }

      return "invalid";
    case "*":
      if (left === "Value") {
        return right;
      }

      if (right === "Value") {
        return left;
      }

      return "invalid";
    case "/":
      if (right === "Value") {
        return left;
      }

      return "invalid";
  }

  return "UnknownValue";
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
