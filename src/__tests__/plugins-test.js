import postcss from "postcss"
import test from "tape"
import stylelint from ".."

function warnAboutFoo(expectation) {
  return (root, result) => {
    let foundFoo
    root.eachRule(rule => {
      if (rule.selector === ".foo") {
        if (expectation === "always") {
          result.warn("found .foo")
          foundFoo = true
        }
      }
    })
    if (!foundFoo) {
      result.warn("never found .foo")
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
    warnAboutFoo,
  },
  rules: {
    warnAboutFoo: [ 2, "always" ],
    "block-no-empty": 2,
  },
}

test("plugin runs", t => {
  t.plan(4)

  const processor = postcss().use(stylelint(configA))

  processor.process(cssA)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo")
    })

  processor.process(cssB)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "never found .foo")
    })
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
      t.equal(result.warnings()[0].text, "found .foo")
    })
})
