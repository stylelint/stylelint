import { compact } from "lodash"

const COMMAND_PREFIX = "stylelint-"
const disableCommand = COMMAND_PREFIX + "disable"
const enableCommand = COMMAND_PREFIX + "enable"
const disableLineCommand = COMMAND_PREFIX + "disable-line"

// Run it like a plugin ...
export default function (root, result) {
  result.stylelint = result.stylelint || {}

  const disabledRanges = result.stylelint.disabledRanges = []

  let withinDisabledRange = false

  root.walkComments(comment => {
    const { text } = comment

    // Ignore comments that are not relevant commands
    if (text.indexOf(COMMAND_PREFIX) !== 0) { return result }

    if (text.indexOf(disableLineCommand) === 0) {
      startDisabledRange(comment, getCommandRules(disableLineCommand, text))
      endDisabledRange(comment)
      return
    }

    if (text.indexOf(disableCommand) === 0) {
      if (withinDisabledRange) {
        throw comment.error(
          "A new disabled range cannot begin until the previous one has ended",
          { plugin: "stylelint" }
        )
      }
      withinDisabledRange = true
      startDisabledRange(comment, getCommandRules(disableCommand, text))
    }

    if (text.indexOf(enableCommand) === 0) {
      if (!withinDisabledRange) {
        throw comment.error(
          "A disabled range cannot end unless it has begun",
          { plugin: "stylelint" }
        )
      }
      withinDisabledRange = false
      endDisabledRange(comment)
    }
  })

  return result

  function startDisabledRange(node, rules) {
    const rangeObj = {
      start: node.source.start.line,
    }

    if (rules.length) {
      rangeObj.rules = rules
    }

    disabledRanges.push(rangeObj)
  }

  function endDisabledRange(node) {
    // Add an `end` prop to the last range
    disabledRanges[disabledRanges.length - 1].end = node.source.end.line
  }
}

function getCommandRules(command, fullText) {
  return compact(fullText.slice(command.length).split(",")).map(r => r.trim())
}
