import chalk from "chalk"
import standalone from "../standalone"
import stringFormatter from "../formatters/stringFormatter"
import test from "tape"

test("standalone with scss syntax", t => {
  let planned = 0
  const config = {
    parser: "postcss-scss",
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    code: "$foo: bar; // foo;\nb {}",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("2:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with sugarss syntax", t => {
  let planned = 0
  const config = {
    parser: "sugarss",
    rules: {
      "length-zero-no-unit": true,
    },
  }

  standalone({
    config,
    code: ".one\n  color: black\n  top: 0px\n.two",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("3:9") !== -1)
    t.ok(strippedOutput.indexOf("length-zero-no-unit") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with Less syntax", t => {
  let planned = 0
  const config = {
    parser: "postcss-less",
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    code: "@foo: bar; // foo;\nb {}",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("2:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
  }).catch(logError)
  planned += 3

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
