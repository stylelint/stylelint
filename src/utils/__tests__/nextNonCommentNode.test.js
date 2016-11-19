import nextNonCommentNode from "../nextNonCommentNode"
import postcss from "postcss"

it("nextNonCommentNode", () => {
  let planned = 0

  const caseA = "a {} /* x */ b {}"
  postcss().process(caseA).then(result => {
    let aNode
    let bNode
    result.root.walkRules(rule => {
      if (rule.selector === "a") {
        aNode = rule
      }
      if (rule.selector === "b") {
        bNode = rule
      }
    })
    expect(nextNonCommentNode(aNode.next())).toBe(bNode)
    expect(nextNonCommentNode(bNode.next())).toBe(null)
  })
  planned += 2

  const caseB = "a { /* x */ color: pink; /* y */ }"
  postcss().process(caseB).then(result => {
    let aNode
    let colorNode
    result.root.walkRules(rule => {
      aNode = rule
    })
    result.root.walkDecls(decl => {
      colorNode = decl
    })
    expect(nextNonCommentNode(aNode.first)).toBe(colorNode)
    expect(nextNonCommentNode(colorNode.next())).toBe(null)
  })
  planned += 2

  t.plan(planned)
})
