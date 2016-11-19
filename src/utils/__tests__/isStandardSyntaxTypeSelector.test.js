import isStandardSyntaxTypeSelector from "../isStandardSyntaxTypeSelector"
import postcss from "postcss"
import selectorParser from "postcss-selector-parser"

it("isStandardSyntaxTypeSelector", () => {
  rules("a {}", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeTruthy()
  })

  rules(".foo:nth-child(n) {}", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })

  rules(".foo:nth-last-child(n) {}", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })

  rules(".foo:nth-of-type(n) {}", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })

  rules(":lang(en) {}", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })

  rules(":dir(ltr) {}", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })

  rules(".foo { &-bar {} }", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })

  rules(".foo { &__bar {} }", func => {
    expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(rule => {
      selectorParser(selectorAST => {
        selectorAST.walkTags(tag => {
          cb(tag)
        })
      }).process(rule.selector)
    })
  }).catch(error => {
    console.log(error) // eslint-disable-line no-console
  })
}
