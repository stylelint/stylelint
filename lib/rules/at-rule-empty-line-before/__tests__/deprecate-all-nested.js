"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "'at-rule-empty-line-before\'s' \"all-nested\" option has been deprecated and in 8.0 will be removed. Instead use the \"inside-block\" option.",
  reference: "https://stylelint.io/user-guide/rules/at-rule-empty-line-before/",
}]

const code = ""

it("deprecation result from 'always, except all-nested' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "always", { except: ["all-nested"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'never, except all-nested' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "never", { except: ["all-nested"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'always, ignore all-nested' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "always", { ignore: ["all-nested"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})

it("deprecation result from 'never, ignore all-nested' config", () => {
  const config = {
    rules: {
      "at-rule-empty-line-before": [ "never", { ignore: ["all-nested"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
