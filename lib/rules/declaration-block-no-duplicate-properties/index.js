"use strict"

const _ = require("lodash")
const isCustomProperty = require("../../utils/isCustomProperty")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "declaration-block-no-duplicate-properties"

const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected duplicate "${property}"`,
})

const rule = function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      actual: options,
      possible: {
        ignore: [
          "consecutive-duplicates",
          "consecutive-duplicates-with-different-values",
        ],
        ignoreProperties: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    // In order to accommodate nested blocks (postcss-nested),
    // we need to run a shallow loop (instead of eachDecl() or eachRule(),
    // which loop recursively) and allow each nested block to accumulate
    // its own list of properties -- so that a property in a nested rule
    // does not conflict with the same property in the parent rule
    root.each(node => {
      if (
        node.type === "rule"
        || node.type === "atrule"
      ) {
        checkRulesInNode(node)
      }
    })

    function checkRulesInNode(node) {
      const decls = []
      const values = []

      node.each(child => {
        if (
          child.nodes
          && child.nodes.length
        ) {
          checkRulesInNode(child)
        }

        if (child.type !== "decl") {
          return
        }

        const prop = child.prop
        const value = child.value

        if (!isStandardSyntaxProperty(prop)) {
          return
        }
        if (isCustomProperty(prop)) {
          return
        }

        // Return early if the property is to be ignored
        if (optionsMatches(options, "ignoreProperties", prop)) {
          return
        }

        // Ignore the src property as commonly duplicated in at-fontface
        if (prop.toLowerCase() === "src") {
          return
        }

        const indexDuplicate = decls.indexOf(prop.toLowerCase())

        if (indexDuplicate !== -1) {
          if (optionsMatches(options, "ignore", "consecutive-duplicates-with-different-values")) {
            // if duplicates are not consecutive
            if (indexDuplicate !== decls.length - 1) {
              report({
                message: messages.rejected(prop),
                node: child,
                result,
                ruleName,
              })
              return
            }
            // if values of consecutive duplicates are equal
            if (value === values[indexDuplicate]) {
              report({
                message: messages.rejected(value),
                node: child,
                result,
                ruleName,
              })
              return
            }
            return
          }

          if (
            optionsMatches(options, "ignore", "consecutive-duplicates")
            && indexDuplicate === decls.length - 1
          ) {
            return
          }

          report({
            message: messages.rejected(prop),
            node: child,
            result,
            ruleName,
          })
        }

        decls.push(prop.toLowerCase())
        values.push(value.toLowerCase())
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
