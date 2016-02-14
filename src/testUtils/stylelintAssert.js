import postcss from "postcss"
import assert from "assert"
import { queue } from "d3-queue"
import normalizeRuleSettings from "../normalizeRuleSettings"
import disableRanges from "../disableRanges"

function createStylelintAssert(equal = assert.equal) {
  return function (rule, schema, callback) {
    const { ruleName } = schema
    const ruleOptions = normalizeRuleSettings(schema.config)
    const rulePrimaryOptions = ruleOptions[0]
    const ruleSecondaryOptions = ruleOptions[1]

    let printableConfig = (rulePrimaryOptions) ? JSON.stringify(rulePrimaryOptions) : ""
    if (printableConfig && ruleSecondaryOptions) {
      printableConfig += ", " + JSON.stringify(ruleSecondaryOptions)
    }

    function buildDescription(code, baseMessage, extraMessage, warnings) {
      let text = `\n\n> rule: ${ruleName}\n`
      text += `> config: ${printableConfig}\n`
      text += `> code: ${JSON.stringify(code)}\n`
      text += "> "
      if (extraMessage) {
        text += `${extraMessage} `
      }
      text += `${baseMessage}\n`
      if (warnings) {
        text += `> warnings:\n`
        warnings.forEach(warning => {
          text += `- ${warning.line}.${warning.column}: ${warning.text}\n`
        })
      }
      return text
    }

    const testQueue = queue()

    if (schema.accept) {
      schema.accept.forEach(acceptable => {
        testQueue.defer(next => {
          postcssProcess(acceptable.code).then(postcssResult => {
            const warnings = postcssResult.warnings()
            const assertDescription = buildDescription(acceptable.code, "should be accepted", acceptable.description, warnings)
            equal(warnings.length, 0, assertDescription)
            next()
          }).catch(next)
        })
      })
    }

    if (schema.reject) {
      schema.reject.forEach(rejectable => {
        testQueue.defer(next => {
          postcssProcess(rejectable.code).then(postcssResult => {
            const warnings = postcssResult.warnings()
            const lengthDescription = buildDescription(rejectable.code, "should be rejected with one warning", rejectable.description, warnings)
            equal(warnings.length, 1, lengthDescription)
            const warning = warnings[0]
            if (!warning) return
            const messageDescription = buildDescription(rejectable.code, `should register warning with message "${rejectable.message}`, rejectable.description, warnings)
            equal(warning.text, rejectable.message, messageDescription)
            if (rejectable.line) {
              const lineDescription = buildDescription(rejectable.code, `should register warning with line ${rejectable.line}`, rejectable.description, warnings)
              equal(warning.line, rejectable.line, lineDescription)
            }
            if (rejectable.column) {
              const columnDescription = buildDescription(rejectable.code, `should register warning with column ${rejectable.column}`, rejectable.description, warnings)
              equal(warning.column, rejectable.column, columnDescription)
            }
            next()
          }).catch(next)
        })
      })
    }

    testQueue.awaitAll(callback)

    function postcssProcess(code) {
      var processor = postcss()
      processor.use(disableRanges)

      if (schema.preceedingPlugins) {
        schema.preceedingPlugins.forEach(processor.use)
      }

      return processor
        .use(rule(rulePrimaryOptions, ruleSecondaryOptions))
        .process(code, schema.postcssOptions)
    }
  }
}

export default createStylelintAssert
