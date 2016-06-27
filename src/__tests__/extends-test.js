import configExtendingAnotherExtend from "./fixtures/config-extending-another-extend"
import configExtendingOne from "./fixtures/config-extending-one"
import configExtendingThreeWithOverride from "./fixtures/config-extending-three-with-override"
import path from "path"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with extending configuration and configBasedir", t => {
  let planned = 0

  standalone({
    code: "a {}",
    config: configExtendingOne,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
  }).catch(logError)
  planned += 4

  // Recursive extending
  standalone({
    code: "a {}",
    config: configExtendingAnotherExtend,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ output, results }) => {
    t.equal(typeof output, "string")
    t.equal(results.length, 1)
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].rule, "block-no-empty")
  }).catch(logError)
  planned += 4

  // Extending with overrides
  standalone({
    code: "a {}",
    config: configExtendingThreeWithOverride,
    configBasedir: path.join(__dirname, "fixtures"),
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 0)
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

test("standalone with extending configuration and no configBasedir", t => {
  let planned = 0

  standalone({
    code: "a {}",
    config: configExtendingOne,
  }).catch(err => {
    t.equal(err.code, 78)
  })
  planned += 1

  t.plan(planned)
})

test("standalone extending a config that is overridden", t => {
  standalone({
    code: "a { b: \"c\" }",
    config: {
      extends: [
        `${fixturesPath}/config-string-quotes-single`,
      ],
      rules: { "string-quotes": "double" },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 0)
  }).catch(logError)
  t.plan(1)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
