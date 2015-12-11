import test from "tape"
import postcss from "postcss"
import stylelint from "../"

const configNumberedSeverity = {
  rules: {
    "block-opening-brace-newline-after": [ 2, "always" ],
    "color-no-invalid-hex": 1,
  },
}

const configNotNumberedSeverity = {
  rules: {
    "block-opening-brace-newline-after": "always",
    "color-no-invalid-hex": [ true, { "warn": true } ],
  },
}

const css = (
`a {
  color: #zzz;
}

b { background: pink; }

/* stylelint-disable color-no-invalid-hex */
.foo {
  color: #yyy;
}
/* stylelint-enable */

.bar:before {
  color: #mmm;
}
`)

test("expected warnings with numbered severities", t => {
  t.plan(10)

  postcss()
    .use(stylelint(configNumberedSeverity))
    .process(css)
    .then(checkResult)
    .catch(err => console.log(err.stack))

  function checkResult(result) {
    const { messages } = result
    t.equal(messages.length, 4)
    t.ok(messages.every(m => m.type === "warning"))
    t.ok(messages.every(m => m.plugin === "stylelint"))
    t.equal(messages[0].stylelintType, "deprecation")
    t.equal(messages[1].text, "Expected newline after \"{\" (block-opening-brace-newline-after)")
    t.equal(messages[1].severity, "error")
    t.equal(messages[2].text, "Unexpected invalid hex color \"#zzz\" (color-no-invalid-hex)")
    t.equal(messages[2].severity, "warning")
    t.equal(messages[3].text, "Unexpected invalid hex color \"#mmm\" (color-no-invalid-hex)")
    t.equal(messages[3].severity, "warning")
  }
})

test("expected warnings with standard severities", t => {
  t.plan(9)

  postcss()
    .use(stylelint(configNotNumberedSeverity))
    .process(css)
    .then(checkResult)
    .catch(err => console.log(err.stack))

  function checkResult(result) {
    const { messages } = result
    t.equal(messages.length, 3)
    t.ok(messages.every(m => m.type === "warning"))
    t.ok(messages.every(m => m.plugin === "stylelint"))
    t.equal(messages[0].text, "Expected newline after \"{\" (block-opening-brace-newline-after)")
    t.equal(messages[0].severity, "error")
    t.equal(messages[1].text, "Unexpected invalid hex color \"#zzz\" (color-no-invalid-hex)")
    t.equal(messages[1].severity, "warning")
    t.equal(messages[2].text, "Unexpected invalid hex color \"#mmm\" (color-no-invalid-hex)")
    t.equal(messages[2].severity, "warning")
  }
})
