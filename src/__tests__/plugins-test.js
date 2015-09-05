import postcss from "postcss"
import test from "tape"
import stylelint from ".."

const warnAboutFooMessages = stylelint.utils.ruleMessages("warn-about-foo", {
  found: "found .foo",
  notFound: "never found .foo",
})

function warnAboutFoo(expectation) {
  return (root, result) => {
    let foundFoo
    root.walkRules(rule => {
      if (rule.selector === ".foo") {
        if (expectation === "always") {
          stylelint.utils.report({
            result,
            ruleName: "warn-about-foo",
            message: warnAboutFooMessages.found,
            node: rule,
          })
          foundFoo = true
        }
      }
    })
    if (!foundFoo) {
      stylelint.utils.report({
        result,
        line: 1,
        ruleName: "warn-about-foo",
        message: warnAboutFooMessages.notFound,
      })
    }
  }
}

const cssA = (
`.foo {}`
)

const cssB = (
`.bar {}`
)

const configA = {
  plugins: {
    "warn-about-foo": warnAboutFoo,
  },
  rules: {
    "warn-about-foo": [ 2, "always" ],
    "block-no-empty": 2,
  },
}

test("plugin runs", t => {
  t.plan(6)

  const processor = postcss().use(stylelint(configA))

  processor.process(cssA)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo (warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(e => console.log(e.stack))

  processor.process(cssB)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "never found .foo (warn-about-foo)")
      t.notOk(result.warnings()[0].node)
    })
    .catch(e => console.log(e.stack))
})

const configB = {
  plugins: {
    linterSet: {
      warnAboutFoo,
    },
  },
  rules: {
    warnAboutFoo: [ 2, "always" ],
    "block-no-empty": 2,
  },
}

test("plugin within set runs", t => {
  t.plan(2)

  const processor = postcss().use(stylelint(configB))

  processor.process(cssA)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo (warn-about-foo)")
    })
})
