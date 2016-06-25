import test from "tape"
import stylelint from "../../.."

test("valid default order", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        properties: [
          "color",
        ],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 0)
  })

  t.plan(1)
})

test("valid 'strict' order", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "strict",
        properties: [
          "color",
        ],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 0)
  })

  t.plan(1)
})

test("valid 'flexible' order", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "flexible",
        properties: [
          "color",
        ],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 0)
  })

  t.plan(1)
})

test("invalid option order option", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "unknown-keyword",
        properties: [
          "color",
        ],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 1)
    t.equal(
      invalidOptionWarnings[0].text,
      "Invalid option \"[{\"order\":\"unknown-keyword\",\"properties\":[\"color\"]}]\" for rule declaration-block-properties-order"
    )
  })

  t.plan(2)
})

test("invalid object lacks 'properties' property", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "flexible",
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 1)
    t.equal(
      invalidOptionWarnings[0].text,
      "Invalid option \"[{\"order\":\"flexible\"}]\" for rule declaration-block-properties-order"
    )
  })

  t.plan(2)
})

test("invalid nested array", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [["nested-array"]],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 1)
    t.equal(
      invalidOptionWarnings[0].text,
      "Invalid option \"[[\"nested-array\"]]\" for rule declaration-block-properties-order"
    )
  })

  t.plan(2)
})

test("invalid object outside of array", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": {
        properties: [
          "color",
        ],
      },
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 1)
    t.equal(
      invalidOptionWarnings[0].text,
      "Invalid option \"{\"properties\":[\"color\"]}\" for rule declaration-block-properties-order"
    )
  })

  t.plan(2)
})
