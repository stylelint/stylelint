"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "'at-rule-empty-line-before\'s' \"blockless-group\" option has been deprecated and in 8.0 will be removed. Instead use the \"blockless-after-blockless\" option.",
  reference: "https://stylelint.io/user-guide/rules/at-rule-empty-line-before/",
}]

const code = ""

it("deprecation result from 'always, except blockless-group' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "always", { except: ["blockless-group"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'never, except blockless-group' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "never", { except: ["blockless-group"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'always, ignore blockless-group' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "always", { ignore: ["blockless-group"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'never, ignore blockless-group' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "never", { ignore: ["blockless-group"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
