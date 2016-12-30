"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "'custom-property-empty-line-before\'s' \"first-nested\" option has been deprecated and in 8.0 will be removed. Instead use the \"after-opening-brace\" option.",
  reference: "http://stylelint.io/user-guide/rules/custom-property-empty-line-before/",
}]

const code = ""

it("deprecation result from 'always, except first-nested' config", () => {
  const config = {
    rules: {
      "custom-property-empty-line-before": [ "always", { except: ["first-nested"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'never, except first-nested' config", () => {
  const config = {
    rules: {
      "custom-property-empty-line-before": [ "never", { except: ["first-nested"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
