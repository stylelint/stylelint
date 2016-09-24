import configExtendingAnotherExtend from "./fixtures/config-extending-another-extend"
import configExtendingOne from "./fixtures/config-extending-one"
import configExtendingThreeWithOverride from "./fixtures/config-extending-three-with-override"
import path from "path"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with extending configuration and configBasedir", t => {
  t.test("basic extending", st => {
    standalone({
      code: "a {}",
      config: configExtendingOne,
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(({ output, results }) => {
      st.equal(typeof output, "string")
      st.equal(results.length, 1)
      st.equal(results[0].warnings.length, 1)
      st.equal(results[0].warnings[0].rule, "block-no-empty")
      st.end()
    }).catch(st.end)
  })

  t.test("recursive extending", st => {
    standalone({
      code: "a {}",
      config: configExtendingAnotherExtend,
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(({ output, results }) => {
      st.equal(typeof output, "string")
      st.equal(results.length, 1)
      st.equal(results[0].warnings.length, 1)
      st.equal(results[0].warnings[0].rule, "block-no-empty")
      st.end()
    }).catch(st.end)
  })

  t.test("extending with overrides", st => {
    standalone({
      code: "a {}",
      config: configExtendingThreeWithOverride,
      configBasedir: path.join(__dirname, "fixtures"),
    }).then(({ results }) => {
      st.equal(results[0].warnings.length, 0)
      st.end()
    }).catch(st.end)
  })

  t.end()
})

test("standalone with extending configuration and no configBasedir", t => {
  standalone({
    code: "a {}",
    config: configExtendingOne,
  }).then(() => {
    t.fail("should have failed")
    t.end()
  }).catch(err => {
    t.equal(err.code, 78)
    t.end()
  })
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
    t.end()
  }).catch(t.end)
})

test("standalone extending a config from process.cwd", t => {
  const actualCwd = process.cwd()
  process.chdir(__dirname)
  standalone({
    code: "a { b: \"c\" }",
    config: {
      extends: ["./fixtures/config-string-quotes-single"],
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 1)
    process.chdir(actualCwd)
    t.end()
  }).catch((err) => {
    process.chdir(actualCwd)
    t.end(err)
  })
})
