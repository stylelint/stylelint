"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const postcss = require("postcss")

const ruleName = "deprecated-variables-rule"

const messages = ruleMessages(ruleName, {
  deprecated: (variable, comment) => `Deprecated usage of variable "${variable}" (${comment})`
})

// keep it outside every files
// still, _variables.less
const deprecatedVariables = {}

const rule = function(isActivated) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: isActivated,
      possible: _.isBoolean
    })

    if (!validOptions) {
      return
    }

    if(!isActivated){
      return;
    }

    // @todo maybe use ``walkComments` instead and lookup @deprecated comments first
    root.walkDecls(decl => {
      const prop = decl.prop;

      if (prop.startsWith('@')) { // currently this rules only match for Less @variables properties, why not generalize this?
          const parentNode = decl.parent.nodes[decl.parent.nodes.indexOf(decl) - 1]
          if (_.get(parentNode, 'text', '').startsWith('@deprecated')) {
            deprecatedVariables[prop] = {
              comment: parentNode.text
            }
          }
      }
    });

    root.walkDecls(decl => {
      const value = decl.value
      if (_.has(deprecatedVariables, value)) {
        report({
          message: messages.deprecated(value, deprecatedVariables[value].comment),
          node: decl,
          result,
          ruleName,
        })
      }
    });

  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
