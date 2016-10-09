import path from "path"
import standalone from "../standalone"
import test from "tape"

test("[normalized rule settings] primary option array", t => {
  standalone({
    code: "a:focus {}",
    config: {
      rules: {
        "selector-pseudo-class-blacklist": ["focus"],
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings[0].rule, "selector-pseudo-class-blacklist")
    t.end()
  }).catch(t.end)
})

test("[normalized rule settings] primary option array in array", t => {
  standalone({
    code: "a:focus {}",
    config: {
      rules: {
        "selector-pseudo-class-blacklist": [["focus"]],
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings[0].rule, "selector-pseudo-class-blacklist")
    t.end()
  }).catch(t.end)
})

test("[normalized rule settings] no-array primary, primary option null", t => {
  standalone({
    code: "a:focus {}",
    config: {
      extends: [path.join(__dirname, "fixtures/config-block-no-empty.json")],
      rules: {
        "block-no-empty": null,
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 0)
    t.end()
  }).catch(t.end)
})

test("[normalized rule settings] no-array primary, primary option null in array", t => {
  standalone({
    code: "a:focus {}",
    config: {
      extends: [path.join(__dirname, "fixtures/config-block-no-empty.json")],
      rules: {
        "block-no-empty": [null],
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 0)
    t.end()
  }).catch(t.end)
})

test("[normalized rule settings] array primary, primary option null", t => {
  standalone({
    code: "a { top: 10px; }",
    config: {
      extends: [path.join(__dirname, "fixtures/config-no-pixels.json")],
      rules: {
        "unit-blacklist": null,
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 0)
    t.end()
  }).catch(t.end)
})

test("[normalized rule settings] array primary, primary option null in array", t => {
  standalone({
    code: "a { top: 10px; }",
    config: {
      extends: [path.join(__dirname, "fixtures/config-no-pixels.json")],
      rules: {
        "unit-blacklist": [null],
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].invalidOptionWarnings.length, 0)
    t.end()
  }).catch(t.end)
})
