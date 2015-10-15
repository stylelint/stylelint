import standalone from "../standalone"
import test from "tape"
import path from "path"
import chalk from "chalk"
import stringFormatter from "../formatters/stringFormatter"
import configBlockNoEmpty from "./fixtures/config-block-no-empty"
import configExtendingOne from "./fixtures/config-extending-one"
import configExtendingAnotherExtend from "./fixtures/config-extending-another-extend"
import configExtendingThreeWithOverride from "./fixtures/config-extending-three-with-override"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with input file(s)", t => {
  let planned = 0

  standalone({ files: `${fixturesPath}/empty-block.css`, config: configBlockNoEmpty })
    .then(({ output, results }) => {
      t.ok(output.indexOf("block-no-empty") !== -1)
      t.equal(results.length, 1)
      t.equal(results[0].warnings.length, 1)
      t.equal(results[0].warnings[0].rule, "block-no-empty")
    })
    .catch(logError)
  planned += 4

  const twoCsses = [ `${fixturesPath}/e*y-block.*`, `${fixturesPath}/invalid-h*.css` ]
  standalone({
    files: twoCsses,
    config: {
      rules: { "block-no-empty": 2, "color-no-invalid-hex": 2 },
    },
  })
    .then(({ output, results }) => {
      t.ok(output.indexOf("block-no-empty") !== -1)
      t.ok(output.indexOf("color-no-invalid-hex") !== -1)
      t.equal(results.length, 2)
      t.equal(results[0].warnings.length, 1)
      t.equal(results[1].warnings.length, 1)
      // Ordering of the files is non-deterministic, I believe
      if (results[0].source.indexOf("empty-block") !== -1) {
        t.equal(results[0].warnings[0].rule, "block-no-empty")
        t.equal(results[1].warnings[0].rule, "color-no-invalid-hex")
      } else {
        t.equal(results[1].warnings[0].rule, "block-no-empty")
        t.equal(results[0].warnings[0].rule, "color-no-invalid-hex")
      }
    })
    .catch(logError)
  planned += 7

  t.plan(planned)
})

test("standalone with input css", t => {
  let planned = 0

  standalone({ css: "a {}", config: configBlockNoEmpty })
    .then(({ output, results }) => {
      t.equal(typeof output, "string")
      t.equal(results.length, 1)
      t.equal(results[0].warnings.length, 1)
      t.equal(results[0].warnings[0].rule, "block-no-empty")
    })
    .catch(logError)
  planned += 4

  t.plan(planned)
})

test("standalone with extending configuration and configBasedir", t => {
  let planned = 0

  standalone({
    css: "a {}",
    config: configExtendingOne,
    configBasedir: path.join(__dirname, "fixtures"),
  })
    .then(({ output, results }) => {
      t.equal(typeof output, "string")
      t.equal(results.length, 1)
      t.equal(results[0].warnings.length, 1)
      t.equal(results[0].warnings[0].rule, "block-no-empty")
    })
    .catch(logError)
  planned += 4

  // Recursive extending
  standalone({
    css: "a {}",
    config: configExtendingAnotherExtend,
    configBasedir: path.join(__dirname, "fixtures"),
  })
    .then(({ output, results }) => {
      t.equal(typeof output, "string")
      t.equal(results.length, 1)
      t.equal(results[0].warnings.length, 1)
      t.equal(results[0].warnings[0].rule, "block-no-empty")
    })
    .catch(logError)
  planned += 4

  // Extending with overrides
  standalone({
    css: "a {}",
    config: configExtendingThreeWithOverride,
    configBasedir: path.join(__dirname, "fixtures"),
  })
    .then(({ results }) => {
      t.equal(results[0].warnings.length, 0)
    })
    .catch(logError)
  planned += 1

  t.plan(planned)
})

test("standalone with extending configuration and no configBasedir", t => {
  let planned = 0

  standalone({
    css: "a {}",
    config: configExtendingOne,
  })
    .then(() => {})
    .catch(err => {
      t.equal(err.message.indexOf("Could not find "), 0)
    })
  planned += 1

  t.plan(planned)
})

test("standalone with input css and alternate formatter specified by keyword", t => {
  let planned = 0

  standalone({ css: "a {}", config: configBlockNoEmpty, formatter: "string" })
    .then(({ output }) => {
      const strippedOutput = chalk.stripColor(output)
      t.equal(typeof output, "string")
      t.ok(strippedOutput.indexOf("1:3") !== -1)
      t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
    })
    .catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with input css and alternate formatter function", t => {
  let planned = 0

  standalone({ css: "a {}", config: configBlockNoEmpty, formatter: stringFormatter })
    .then(({ output }) => {
      const strippedOutput = chalk.stripColor(output)
      t.equal(typeof output, "string")
      t.ok(strippedOutput.indexOf("1:3") !== -1)
      t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
    })
    .catch(logError)
  planned += 3

  t.plan(planned)
})

test("standalone with input css and quiet mode", t => {
  let planned = 0
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": 1,
    },
  }

  standalone({ css: "a {}", config })
    .then(({ output }) => {
      const parsedOutput = JSON.parse(output)
      t.deepEqual(parsedOutput[0].warnings, [])
    })
    .catch(logError)
  planned += 1

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack)
}
