"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "\'declaration-block-properties-order\'has been deprecated and in 8.0 will be removed. Instead use the community \'stylelint-order\' plugin pack.",
  reference: "https://stylelint.io/user-guide/rules/declaration-block-properties-order/",
}]

it("deprecation result from valid config", () => {
  const config = {
    rules: {
      "declaration-block-properties-order": [{
        properties: ["color"],
      }],
    },
  }
  return stylelint.lint({
    code: "",
    config,
  }).then(function (data) {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
