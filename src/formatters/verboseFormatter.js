import _ from "lodash"
import stringFormatter from "./stringFormatter"
import chalk from "chalk"

export default function (results) {
  let output = stringFormatter(results)

  if (output === "") { output = "\n" }

  const sourceWord = (results.length > 1) ? "sources" : "source"
  output += chalk.underline(`${results.length} ${sourceWord} checked\n`)
  results.forEach(result => {
    let formatting = "green"
    if (result.errored) {
      formatting = "red"
    } else if (result.warnings.length) {
      formatting = "yellow"
    }
    output += _.get(chalk, formatting)(` ${result.source}\n`)
  })

  const warnings = _.flatten(results.map(r => r.warnings))
  const warningsBySeverity = _.groupBy(warnings, "severity")
  const problemWord = (warnings.length === 1) ? "problem" : "problems"

  output += chalk.underline(`\n${warnings.length} ${problemWord} found\n`)

  _.forOwn(warningsBySeverity, (warningList, severityLevel) => {
    const warningsByRule = _.groupBy(warningList, "rule")
    output += ` severity level "${severityLevel}": ${warningList.length}\n`
    _.forOwn(warningsByRule, (list, rule) => {
      output += chalk.gray(`  ${rule}: ${list.length}\n`)
    })
  })

  return output + "\n"
}
