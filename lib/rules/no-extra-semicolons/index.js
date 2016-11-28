"use strict"

const hasEmptyBlock = require("../../utils/hasEmptyBlock")
const isCustomPropertySet = require("../../utils/isCustomPropertySet")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const styleSearch = require("style-search")

const ruleName = "no-extra-semicolons"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected extra semicolon",
})

function getOffsetByNode(node) {
  const string = node.root().toString()
  const nodeColumn = node.source.start.column
  const nodeLine = node.source.start.line
  let line = 1
  let column = 1
  let index = 0

  for (let i = 0; i < string.length; i++) {
    if (column === nodeColumn && nodeLine === line) {
      index = i
      break
    }

    if (string[i] === "\n") {
      column = 1
      line += 1
    } else {
      column += 1
    }
  }

  return index
}

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    const rawAfterRoot = root.raws.after

    if (rawAfterRoot && rawAfterRoot.trim().length !== 0) {
      styleSearch({ source: rawAfterRoot, target: ";" }, match => {
        complain(root.toString().length - rawAfterRoot.length + match.startIndex)
      })
    }

    root.walk(node => {
      const rawBeforeNode = node.raws.before

      if (rawBeforeNode && rawBeforeNode.trim().length !== 0) {
        let allowedSemi = 0

        // Forbid semicolon before first custom properties sets
        if (isCustomPropertySet(node) && node.parent.index(node) > 0) {
          allowedSemi = 1
        }

        styleSearch({ source: rawBeforeNode, target: ";" }, (match, count) => {
          if (count === allowedSemi) {
            return
          }

          complain(getOffsetByNode(node) - rawBeforeNode.length + match.startIndex)
        })
      }

      const rawAfterNode = node.raws.after

      if (rawAfterNode && rawAfterNode.trim().length !== 0) {
        let allowedSemi = 0

        if (!hasEmptyBlock(node) && isCustomPropertySet(node.nodes[node.nodes.length - 1])) {
          allowedSemi = 1
        }

        styleSearch({ source: rawAfterNode, target: ";" }, (match, count) => {
          if (count === allowedSemi) {
            return
          }

          const index = getOffsetByNode(node) + node.toString().length - 1 - rawAfterNode.length + match.startIndex
          complain(index)
        })
      }
    })

    function complain(index) {
      report({
        message: messages.rejected,
        node: root,
        index,
        result,
        ruleName,
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
