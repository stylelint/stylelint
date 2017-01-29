"use strict"

const stylelint = require("../../..")

const deprecationResult = [{
  text: "'comment-empty-line-before\'s' \"between-comments\" option has been deprecated and in 8.0 will be removed. Instead use the \"after-comment\" option.",
  reference: "https://stylelint.io/user-guide/rules/comment-empty-line-before/",
}]

const code = ""

it("deprecation result from 'always, ignore between-comments' config", () => {
  const config = {
    rules: {
      "comment-empty-line-before": [ "always", { ignore: ["between-comments"] } ],
    },
  }
  return stylelint.lint({ code, config }).then(data => {
    expect(data.results[0].deprecations.length).toEqual(1)
    expect(data.results[0].deprecations).toEqual(deprecationResult)
  })
})
