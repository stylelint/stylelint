/* @flow */
import isStandardSyntaxFunction from "../isStandardSyntaxFunction"
import postcss from "postcss"
import valueParser from "postcss-value-parser"

describe("isStandardSyntaxFunction", () => {
  it("calc", () => {
    rules("a { prop: calc(a + b) }", func => {
      expect(isStandardSyntaxFunction(func)).toBeTruthy()
    })
  })

  it("url", () => {
    rules("a { prop: url('x.css') }", func => {
      expect(isStandardSyntaxFunction(func)).toBeTruthy()
    })
  })

  it("scss list", () => {
    rules("a { $list: (list) }", func => {
      expect(isStandardSyntaxFunction(func)).toBeFalsy()
    })
  })

  it("scss map", () => {
    rules("a { $map: (key: value) }", func => {
      expect(isStandardSyntaxFunction(func)).toBeFalsy()
    })
  })
})

function rules(
  css: string,
  cb: Function
): Promise<postcss$result> {
  return postcss().process(css)
  .then(result => {
    return result.root.walkDecls(decl => {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function") { return }
        cb(valueNode)
      })
    })
  })
}
