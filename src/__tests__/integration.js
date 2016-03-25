import test from "tape"
import postcss from "postcss"
import stylelint from "../"

const config = {
  rules: {
    "block-opening-brace-newline-after": "always",
    "declaration-block-properties-order": [
      {
        emptyLineBefore: "always",
        properties: [
          "content",
        ],
      },
      {
        emptyLineBefore: "always",
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
    "color-no-invalid-hex": [ true, {
      severity: "warning",
      message: "You made a mistake",
    } ],
    "function-blacklist": ["calc"],
    "function-whitelist": null,
    "no-duplicate-selectors": true,
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

test("integration test expecting warnings", t => {
  t.plan(9)

  postcss()
    .use(stylelint(config))
    .process(css)
    .then(checkResult)
    .catch(logError)

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

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
