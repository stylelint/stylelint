const path = require("path")
const standalone = require("../standalone")

it("[normalized rule settings] primary option array", () => {
  return standalone({
    code: "a:focus {}",
    config: {
      rules: {
        "selector-pseudo-class-blacklist": ["focus"],
      },
    },
  }).then((_ref) => {
    const results = _ref.results

    expect(results[0].warnings[0].rule).toBe("selector-pseudo-class-blacklist")
  })
})

it("[normalized rule settings] primary option array in array", () => {
  return standalone({
    code: "a:focus {}",
    config: {
      rules: {
        "selector-pseudo-class-blacklist": [["focus"]],
      },
    },
  }).then((_ref2) => {
    const results = _ref2.results

    expect(results[0].warnings[0].rule).toBe("selector-pseudo-class-blacklist")
  })
})

it("[normalized rule settings] no-array primary, primary option null", () => {
  return standalone({
    code: "a:focus {}",
    config: {
      extends: [path.join(__dirname, "fixtures/config-block-no-empty.json")],
      rules: {
        "block-no-empty": null,
      },
    },
  }).then((_ref3) => {
    const results = _ref3.results

    expect(results[0].warnings.length).toBe(0)
  })
})

it("[normalized rule settings] no-array primary, primary option null in array", () => {
  return standalone({
    code: "a:focus {}",
    config: {
      extends: [path.join(__dirname, "fixtures/config-block-no-empty.json")],
      rules: {
        "block-no-empty": [null],
      },
    },
  }).then((_ref4) => {
    const results = _ref4.results

    expect(results[0].warnings.length).toBe(0)
  })
})

it("[normalized rule settings] array primary, primary option null", () => {
  return standalone({
    code: "a { top: 10px; }",
    config: {
      extends: [path.join(__dirname, "fixtures/config-no-pixels.json")],
      rules: {
        "unit-blacklist": null,
      },
    },
  }).then((_ref5) => {
    const results = _ref5.results

    expect(results[0].warnings.length).toBe(0)
  })
})

it("[normalized rule settings] array primary, primary option null in array", () => {
  return standalone({
    code: "a { top: 10px; }",
    config: {
      extends: [path.join(__dirname, "fixtures/config-no-pixels.json")],
      rules: {
        "unit-blacklist": [null],
      },
    },
  }).then((_ref6) => {
    const results = _ref6.results

    expect(results[0].invalidOptionWarnings.length).toBe(0)
  })
})
