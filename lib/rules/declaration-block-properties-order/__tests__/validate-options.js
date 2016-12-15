"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "\'declaration-block-properties-order\'has been deprecated and in 8.0 will be removed. Instead use the community \'stylelint-order\' plugin pack.",
  reference: "http://stylelint.io/user-guide/rules/declaration-block-properties-order/",
}]

it("valid default order", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        properties: [
          "color",
        ],
      }],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("valid 'strict' order", () => {
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
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("valid 'flexible' order", () => {
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
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("valid order with a group and one outside property before the group", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [
        "height",
        {
          properties: [
            "color",
          ],
        },
      ],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("valid order with a group and one outside property after the group", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [
        {
          properties: [
            "color",
          ],
        },
        "height",
      ],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("valid order with a group and two outside properties before the group", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [
        "height",
        "width",
        {
          properties: [
            "color",
          ],
        },
      ],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("valid order with groups and one outside property before groups", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [
        "height",
        {
          properties: [
            "color",
          ],
        },
        {
          properties: [
            "width",
          ],
        },
      ],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const results = data.results[0]
    expect(results.deprecations.length).toEqual(1)
    expect(results.deprecations).toEqual(deprecationResult)
    expect(results.invalidOptionWarnings.length).toBe(0)
  })
})

it("invalid option order option", () => {
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
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    expect(invalidOptionWarnings.length).toBe(1)
    expect(invalidOptionWarnings[0].text).toBe(
      "Invalid option \"[{\"order\":\"unknown-keyword\",\"properties\":[\"color\"]}]\" for rule declaration-block-properties-order"
    )
  })
})

it("invalid object lacks 'properties' property", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "flexible",
      }],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    expect(invalidOptionWarnings.length).toBe(1)
    expect(invalidOptionWarnings[0].text).toBe(
      "Invalid option \"[{\"order\":\"flexible\"}]\" for rule declaration-block-properties-order"
    )
  })
})

it("invalid object outside of array", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": {
        properties: [
          "color",
        ],
      },
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    expect(invalidOptionWarnings.length).toBe(1)
    expect(invalidOptionWarnings[0].text).toBe(
      "Invalid option \"{\"properties\":[\"color\"]}\" for rule declaration-block-properties-order"
    )
  })
})
