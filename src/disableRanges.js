import _ from "lodash"

const COMMAND_PREFIX = "stylelint-"
const disableCommand = COMMAND_PREFIX + "disable"
const enableCommand = COMMAND_PREFIX + "enable"
const disableLineCommand = COMMAND_PREFIX + "disable-line"
const disableNextLineCommand = COMMAND_PREFIX + "disable-next-line"
const ALL_RULES = "all"

// Run it like a plugin ...
export default function (root, result) {
  result.stylelint = result.stylelint || {}

  const disabledRanges = result.stylelint.disabledRanges = {
    all: [],
  }
  const currentlyDisabledRules = new Set()

  root.walkComments(checkComment)

  return result

  function processDisableLineCommand(comment) {
    getCommandRules(disableLineCommand, comment.text).forEach(ruleName => {
      disableLine(comment.source.start.line, ruleName, comment)
    })
  }

  function processDisableNextLineCommand(comment) {
    getCommandRules(disableNextLineCommand, comment.text).forEach(ruleName => {
      disableLine(comment.source.start.line + 1, ruleName, comment)
    })
  }

  function disableLine(line, ruleName, comment) {
    if (currentlyDisabledRules.has(ALL_RULES)) {
      throw comment.error("All rules have already been disabled", { plugin: "stylelint" })
    }
    if (currentlyDisabledRules.has(ruleName)) {
      throw comment.error(`"${ruleName}" has already been disabled`, { plugin: "stylelint" })
    }
    if (ruleName === ALL_RULES) {
      Object.keys(disabledRanges).forEach(disabledRuleName => {
        startDisabledRange(line, disabledRuleName)
        endDisabledRange(line, disabledRuleName)
      })
    } else {
      startDisabledRange(line, ruleName)
      endDisabledRange(line, ruleName)
    }
  }

  function processDisableCommand(comment) {
    getCommandRules(disableCommand, comment.text).forEach(ruleToDisable => {
      const alreadyDisabled = currentlyDisabledRules.has(ruleToDisable)
      // If all rules have already been disabled and we're trying to do it again ...
      if (ruleToDisable === ALL_RULES && alreadyDisabled) {
        throw comment.error("All rules have already been disabled", { plugin: "stylelint" })
      }
      // If all rules have already been disabled or this specific rule has been ...
      if (alreadyDisabled) {
        throw comment.error(`"${ruleToDisable}" has already been disabled`, { plugin: "stylelint" })
      }

      if (ruleToDisable === ALL_RULES) {
        Object.keys(disabledRanges).forEach(ruleName => {
          startDisabledRange(comment.source.start.line, ruleName)
        })
      } else {
        startDisabledRange(comment.source.start.line, ruleToDisable)
      }
      currentlyDisabledRules.add(ruleToDisable)
    })
  }

  function processEnableCommand(comment) {
    getCommandRules(enableCommand, comment.text).forEach(ruleToEnable => {
      if (ruleToEnable === ALL_RULES) {
        if (_.values(disabledRanges).every(ranges => _.isEmpty(ranges) || !!_.last(ranges.end))) {
          throw comment.error("No rules have been disabled", { plugin: "stylelint" })
        }
        Object.keys(disabledRanges).forEach(ruleName => {
          if (!_.get(_.last(disabledRanges[ruleName]), "end")) {
            endDisabledRange(comment.source.end.line, ruleName)
          }
        })
        currentlyDisabledRules.clear()
        return
      }

      if (currentlyDisabledRules.has(ALL_RULES) && !currentlyDisabledRules.has(ruleToEnable)) {
        // Get a starting point from the where all rules were disabled
        if (!disabledRanges[ruleToEnable]) {
          disabledRanges[ruleToEnable] = _.cloneDeep(disabledRanges.all)
        } else {
          disabledRanges[ruleToEnable].push(_.clone(_.last(disabledRanges[ALL_RULES])))
        }
        endDisabledRange(comment.source.end.line, ruleToEnable)
        return
      }

      if (currentlyDisabledRules.has(ruleToEnable)) {
        endDisabledRange(comment.source.end.line, ruleToEnable)
        currentlyDisabledRules.delete(ruleToEnable)
        return
      }

      throw comment.error(`"${ruleToEnable}" has not been disabled`, { plugin: "stylelint" })
    })
  }

  function checkComment(comment) {
    const { text } = comment

    // Ignore comments that are not relevant commands
    if (text.indexOf(COMMAND_PREFIX) !== 0) { return result }

    if (text.indexOf(disableLineCommand) === 0) {
      processDisableLineCommand(comment)
    } else if (text.indexOf(disableNextLineCommand) === 0) {
      processDisableNextLineCommand(comment)
    } else if (text.indexOf(disableCommand) === 0) {
      processDisableCommand(comment)
    } else if (text.indexOf(enableCommand) === 0) {
      processEnableCommand(comment)
    }
  }

  function getCommandRules(command, fullText) {
    const rules = _.compact(fullText.slice(command.length).split(",")).map(r => r.trim())
    if (_.isEmpty(rules)) { return [ALL_RULES] }
    return rules
  }

  function startDisabledRange(line, ruleName) {
    const rangeObj = { start: line }
    ensureRuleRanges(ruleName)
    disabledRanges[ruleName].push(rangeObj)
  }

  function endDisabledRange(line, ruleName) {
    const lastRangeForRule = _.last(disabledRanges[ruleName])
    if (!lastRangeForRule) { return }
    // Add an `end` prop to the last range of that rule
    lastRangeForRule.end = line
  }

  function ensureRuleRanges(ruleName) {
    if (!disabledRanges[ruleName]) {
      disabledRanges[ruleName] = _.cloneDeep(disabledRanges.all)
    }
  }
}
