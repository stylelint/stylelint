import postcss from "postcss"
import _ from "lodash"
import normalizeRuleSettings from "../normalizeRuleSettings"
import disableRanges from "../disableRanges"

export default function (equalityCheck) {
  return function (rule, schema) {
    const { ruleName } = schema
    const ruleOptions = normalizeRuleSettings(schema.config)
    const rulePrimaryOptions = ruleOptions[0]
    const ruleSecondaryOptions = ruleOptions[1]

    let printableConfig = (rulePrimaryOptions) ? JSON.stringify(rulePrimaryOptions) : ""
    if (printableConfig && ruleSecondaryOptions) {
      printableConfig += ", " + JSON.stringify(ruleSecondaryOptions)
    }

    function createCaseDescription(code) {
      let text = `\n> rule: ${ruleName}\n`
      text += `> config: ${printableConfig}\n`
      text += `> code: ${JSON.stringify(code)}\n`
      return text
    }

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

    if (schema.accept) {
      schema.accept.forEach(acceptedCase => {
        const assertionDescription = spaceJoin(acceptedCase.description, "should be accepted")
        const resultPromise = postcssProcess(acceptedCase.code).then(postcssResult => {
          const warnings = postcssResult.warnings()
          return [{
            expected: 0,
            actual: warnings.length,
            description: assertionDescription,
          }]
        })
        equalityCheck(resultPromise, {
          caseDescription: createCaseDescription(acceptedCase.code),
          completeAssertionDescription: assertionDescription,
        })
      })
    }

    if (schema.reject) {
      schema.reject.forEach(rejectable => {
        let completeAssertionDescription = "should register one warning"
        if (rejectable.line) completeAssertionDescription += ` on line ${rejectable.line}`
        if (rejectable.column) completeAssertionDescription += ` on column ${rejectable.column}`
        if (rejectable.message) completeAssertionDescription += ` with message "${rejectable.message}"`

        const resultPromise = postcssProcess(rejectable.code).then(postcssResult => {
          const warnings = postcssResult.warnings()
          const comparisons = [{
            expected: 1,
            actual: warnings.length,
            description: spaceJoin(rejectable.description, "should register one warning"),
          }]
          if (!warnings.length) return comparisons

          const warning = warnings[0]

          if (rejectable.line) {
            comparisons.push({
              expected: rejectable.line,
              actual: warning.line,
              description: spaceJoin(rejectable.description, `should warn on line ${rejectable.line}`),
            })
          }
          if (rejectable.column !== undefined) {
            comparisons.push({
              expected: rejectable.column,
              actual: warning.column,
              description: spaceJoin(rejectable.description, `should warn on column ${rejectable.column}`),
            })
          }
          if (rejectable.message) {
            comparisons.push({
              expected: rejectable.message,
              actual: warning.text,
              description: spaceJoin(rejectable.description, `should warn with message ${rejectable.message}`),
            })
          }
          return comparisons
        })

        equalityCheck(resultPromise, {
          caseDescription: createCaseDescription(rejectable.code),
          completeAssertionDescription: completeAssertionDescription,
        })
      })
    }
  }
}

function spaceJoin(...args) {
  return _.compact(args).join(" ")
}
