"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "'comment-empty-line-before\'s' \"stylelint-commands\" option has been deprecated and in 8.0 will be removed. Instead use the \"stylelint-command\" option.",
  reference: "http://stylelint.io/user-guide/rules/comment-empty-line-before/",
}]

const code = ""

it("deprecation result from 'always, ignore stylelint-commands' config", () => {
  const config = {
    rules: {
      "comment-empty-line-before": [ "always", { ignore: ["stylelint-commands"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
