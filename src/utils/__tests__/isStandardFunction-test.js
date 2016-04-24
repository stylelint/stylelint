import isStandardFunction from "../isStandardFunction"
import postcss from "postcss"
import test from "tape"
import valueParser from "postcss-value-parser"

test("isStandardFunction", t => {
  t.plan(4)

  rules("a { prop: calc(a + b) }", func => {
    t.ok(isStandardFunction(func), "calc")
  })

  rules("a { prop: url('x.css') }", func => {
    t.ok(isStandardFunction(func), "url")
  })

  rules("a { $list: (list) }", func => {
    t.notOk(isStandardFunction(func), "scss list")
  })

  rules("a { $map: (key: value) }", func => {
    t.notOk(isStandardFunction(func), "scss map")
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
