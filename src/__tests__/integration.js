import lessSyntax from "postcss-less"
import postcss from "postcss"
import scssSyntax from "postcss-scss"
import stylelint from "../"
import test from "tape"

const config = {
  rules: {
    "block-opening-brace-newline-after": "always",
    "declaration-block-properties-order": [
      {
        properties: [
          "content",
        ],
      },
      {
        properties: [
          "display",
          "height",
        ],
      },
    ],
    "declaration-property-unit-blacklist": {
      "width": [ "px", "em" ],
    },
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
`
a { background: pink; }

b {
  height: 1rem;
  display: block;
  width: 10px;
  color: #zzz;
}

/* stylelint-disable color-no-invalid-hex */
.foo {
  color: #yyy;
}
/* stylelint-enable */

.bar:before {
  color: #mmm;
  height: calc(1rem - 100%)
}
`)

test("integration test expecting warnings", t => {
  postcss()
    .use(stylelint(config))
    .process(css)
    .then(checkResult)
    .catch(t.end)

  function checkResult(result) {
    const { messages } = result
    t.equal(messages.length, 6)
    t.ok(messages.every(m => m.type === "warning"))
    t.ok(messages.every(m => m.plugin === "stylelint"))

    // block-opening-brace-newline-after - string primary option
    t.equal(messages[0].text, "Expected newline after \"{\" (block-opening-brace-newline-after)")
    t.equal(messages[0].severity, "error")

    // declaration-block-properties-order - nested array primary option
    t.equal(messages[1].text, "Expected \"display\" to come before \"height\" (declaration-block-properties-order)")
    t.equal(messages[1].severity, "error")

    // declaration-property-unit-blacklist - object primary option
    t.equal(messages[2].text, "Unexpected unit \"px\" for property \"width\" (declaration-property-unit-blacklist)")
    t.equal(messages[2].severity, "error")

    // color-no-invalid-hex - true primary option
    t.equal(messages[3].text, "You made a mistake")
    t.equal(messages[3].severity, "warning")
    t.equal(messages[4].text, "You made a mistake")
    t.equal(messages[4].severity, "warning")

    // function-blacklist - array primary option
    t.equal(messages[5].text, "Unexpected function \"calc\" (function-blacklist)")
    t.equal(messages[5].severity, "error")

    t.end()
  }
})

const less = (
`.foo(@bar) {
    color: @bar;
}
`)

test("Less integration test", t => {
  postcss()
    .use(stylelint({ rules: {} }))
    .process(less, { syntax: lessSyntax })
    .then(checkResult)
    .catch(t.end)

  function checkResult(result) {
    t.equal(result.messages.length, 0)
    t.end()
  }
})

const scss = (
  `.foo-#{variable} {
    color: $color;
}
`)

test("Scss integration test", t => {
  postcss()
    .use(stylelint({ rules: {} }))
    .process(scss, { syntax: scssSyntax })
    .then(checkResult)
    .catch(t.end)

  function checkResult(result) {
    t.equal(result.messages.length, 0)
    t.end()
  }
})
