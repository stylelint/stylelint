import test from "tape"
import stylelint from "../../index"
import jsonFormatter from "../jsonFormatter"

const config = {
  "rules": {
    "number-leading-zero": "always",
  },
}

test("expected warnings against css", t => {
  stylelint.lint({
    code: "a { top: .2em; }",
    config,
    formatter: jsonFormatter,
  })
    .then(function (data) {
      t.equal(
        data.output,
        "[{"
          + `"source":"${data.results[0].source}",`
          + "\"deprecations\":[],"
          + "\"invalidOptionWarnings\":[],"
          + "\"errored\":true,"
          + "\"warnings\":["
          + "{"
            + "\"line\":1,"
            + "\"column\":9,"
            + "\"rule\":\"number-leading-zero\","
            + "\"severity\":\"error\","
            + "\"text\":\"Expected a leading zero (number-leading-zero)\""
          + "}"
        + "]}]"
      )
    })
    .catch(function (err) {
      throw err
    })
  t.end()
})

test("expected success against css", t => {
  stylelint.lint({
    code: "a { top: 0.2em; }",
    config,
    formatter: jsonFormatter,
  })
    .then(function (data) {
      t.equal(
        data.output,
        "[{"
          + `"source":"${data.results[0].source}",`
          + "\"deprecations\":[],"
          + "\"invalidOptionWarnings\":[],"
          + "\"warnings\":[]"
        + "}]")
    })
    .catch(function (err) {
      throw err
    })
  t.end()
})

test("expected success against files", t => {
  stylelint.lint({
    files: "fixtures/*.css",
    config,
    formatter: jsonFormatter,
  })
    .then(function (data) {
      t.equal(
        data.output,
        "[{"
          + `"source":"${__dirname}/fixtures/a.css",`
          + "\"deprecations\":[],"
          + "\"invalidOptionWarnings\":[],"
          + "\"warnings\":[]"
        + "},{"
          + `"source":"${__dirname}/fixtures/b.css",`
          + "\"deprecations\":[],"
          + "\"invalidOptionWarnings\":[],"
          + "\"warnings\":[]"
        + "}]"
      )
    })
    .catch(function (err) {
      throw err
    })
  t.end()
})
