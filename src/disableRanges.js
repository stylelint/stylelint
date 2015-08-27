import { compact } from "lodash"

const commandPrefix = "stylelint-"
const disableCommand = commandPrefix + "disable"
const enableCommand = commandPrefix + "enable"

// Run it like a plugin ...
export default function (root, result) {
  result.disabledRanges = []

  let withinDisabledRange = false

  result.root.walkComments(comment => {
    const { text } = comment

    // Ignore comments that are not relevant commands
    if (text.indexOf(commandPrefix) !== 0) { return result }

    if (text.indexOf(disableCommand) === 0) {
      if (withinDisabledRange) {
        comment.error("A new disabled range cannot begin until the previous one has ended")
        return result
      }
      withinDisabledRange = true
      const rules = compact(text.slice(disableCommand.length).split(","))
        .map(r => r.trim())
      startDisabledRange(comment, rules)
    }
    if (text.indexOf(enableCommand) === 0) {
      if (!withinDisabledRange) {
        comment.error("A disabled range cannot end unless it has begun")
        return result
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

    result.disabledRanges.push(rangeObj)
  }

  function endDisabledRange(node) {
    // Add an `end` prop to the last range
    result.disabledRanges[result.disabledRanges.length - 1].end = node.source.end.line
  }
}
