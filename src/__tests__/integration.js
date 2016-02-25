import test from "tape"
import postcss from "postcss"
import stylelint from "../"

const config = {
  rules: {
    "block-opening-brace-newline-after": "always",
    "color-no-invalid-hex": [ true, {
      severity: "warning",
      message: "You made a mistake",
    } ],
    "function-blacklist": ["calc"],
    "function-whitelist": null,
    "rule-properties-order": [
      {
        emptyLineBefore: true,
        properties: [
          "content",
        ],
      },
      {
        emptyLineBefore: true,
        properties: [
          "position",
          "top",
          "right",
          "bottom",
          "left",
          "z-index",
        ],
      },
    ],
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

test("ingration test expecting warnings", t => {
  t.plan(9)

  postcss()
    .use(stylelint(config))
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
    t.equal(messages[1].text, "You made a mistake")
    t.equal(messages[1].severity, "warning")
    t.equal(messages[2].text, "You made a mistake")
    t.equal(messages[2].severity, "warning")
  }
})
