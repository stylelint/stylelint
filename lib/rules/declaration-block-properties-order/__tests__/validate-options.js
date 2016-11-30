"use strict"

const stylelint = require("../../..")
const test = require("tape")

test("valid default order", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        properties: ["color"],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 0)
    t.end()
  }).catch(t.end)
})

test("valid 'strict' order", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "strict",
        properties: ["color"],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 0)
    t.end()
  }).catch(t.end)
})

test("valid 'flexible' order", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        order: "flexible",
        properties: ["color"],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 0)
    t.end()
  }).catch(t.end)
})

test("valid order with a group and one outside property before the group", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [ "height", {
        properties: ["color"],
      } ],
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

test("valid order with a group and one outside property after the group", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [ {
        properties: ["color"],
      }, "height" ],
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

test("valid order with a group and two outside properties before the group", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [ "height", "width", {
        properties: ["color"],
      } ],
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

test("valid order with groups and one outside property before groups", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": [ "height", {
        properties: ["color"],
      }, {
        properties: ["width"],
      } ],
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
        properties: ["color"],
      }],
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 1)
    t.equal(invalidOptionWarnings[0].text, "Invalid option \"[{\"order\":\"unknown-keyword\",\"properties\":[\"color\"]}]\" for rule declaration-block-properties-order")
    t.end()
  }).catch(t.end)
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
    t.equal(invalidOptionWarnings[0].text, "Invalid option \"[{\"order\":\"flexible\"}]\" for rule declaration-block-properties-order")
    t.end()
  }).catch(t.end)
})

test("invalid object outside of array", t => {
  const config = {
    rules: {
      "declaration-block-properties-order": {
        properties: ["color"],
      },
    },
  }
  stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    const invalidOptionWarnings = data.results[0].invalidOptionWarnings
    t.equal(invalidOptionWarnings.length, 1)
    t.equal(invalidOptionWarnings[0].text, "Invalid option \"{\"properties\":[\"color\"]}\" for rule declaration-block-properties-order")
    t.end()
  }).catch(t.end)
})
