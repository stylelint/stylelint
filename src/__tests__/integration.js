import test from "tape"
import postcss from "postcss"
import stylelint from "../"

const config = {
  rules: {
    "block-opening-brace-newline-after": [ 2, "always" ],
    "color-no-invalid-hex": 2,
    "selector-pseudo-element-colon-notation": [ 2, "double" ],
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

postcss()
  .use(stylelint(config))
  .process(css)
  .then(checkResult)
  .catch(e => console.log(e.stack))

function checkResult(result) {
  const { messages } = result
  test("expected warnings", t => {
    t.equal(messages.length, 4, "number of errors")
    t.ok(messages.every(m => m.type === "warning"))
    t.ok(messages.every(m => m.plugin === "stylelint"))
    t.equal(messages[0].text, "Expected newline after \"{\" (block-opening-brace-newline-after)", "first error message")
    t.equal(messages[1].text, "Unexpected invalid hex color \"#zzz\" (color-no-invalid-hex)", "second error message")
    t.equal(messages[2].text, "Unexpected invalid hex color \"#mmm\" (color-no-invalid-hex)", "fourth error message")
    t.equal(messages[3].text, "Expected double colon pseudo-element notation (selector-pseudo-element-colon-notation)", "third error message")
    t.end()
  })
}
