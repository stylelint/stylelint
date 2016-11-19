import isStandardSyntaxFunction from "../isStandardSyntaxFunction"
import postcss from "postcss"
import valueParser from "postcss-value-parser"

it("isStandardSyntaxFunction", () => {
  rules("a { prop: calc(a + b) }", func => {
    expect(isStandardSyntaxFunction(func)).toBeTruthy()
  })

  rules("a { prop: url('x.css') }", func => {
    expect(isStandardSyntaxFunction(func)).toBeTruthy()
  })

  rules("a { $list: (list) }", func => {
    expect(isStandardSyntaxFunction(func)).toBeFalsy()
  })

  rules("a { $map: (key: value) }", func => {
    expect(isStandardSyntaxFunction(func)).toBeFalsy()
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(decl => {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function") { return }
        cb(valueNode)
      })
    })
  })
}
