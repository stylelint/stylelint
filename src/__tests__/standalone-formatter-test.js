import chalk from "chalk"
import configBlockNoEmpty from "./fixtures/config-block-no-empty"
import standalone from "../standalone"
import stringFormatter from "../formatters/stringFormatter"
import test from "tape"

test("standalone with input css and alternate formatter specified by keyword", t => {
  let planned = 0

  standalone({ code: "a {}", config: configBlockNoEmpty, formatter: "string" }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("1:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with input css and alternate formatter function", t => {
  let planned = 0

  standalone({ code: "a {}", config: configBlockNoEmpty, formatter: stringFormatter }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("1:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
