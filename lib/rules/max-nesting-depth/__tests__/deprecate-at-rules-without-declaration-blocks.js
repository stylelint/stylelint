"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "'max-nesting-depth\'s' \"at-rules-without-declaration-blocks\" option has been deprecated and in 8.0 will be removed. Instead use the \"blockless-at-rules\" option.",
  reference: "https://stylelint.io/user-guide/rules/max-nesting-depth/",
}]

it("deprecation result from '1, ignore at-rules-without-declaration-blocks' config", () => {
  const code = ""
  const config = {
    rules: {
      "max-nesting-depth": [ 1, { ignore: ["at-rules-without-declaration-blocks"] } ],
    },
  }

  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
