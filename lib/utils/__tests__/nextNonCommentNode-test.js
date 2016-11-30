"use strict"

const nextNonCommentNode = require("../nextNonCommentNode")
const postcss = require("postcss")
const test = require("tape")

test("nextNonCommentNode", t => {
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
    t.equal(nextNonCommentNode(aNode.next()), bNode, "starting with comment")
    t.equal(nextNonCommentNode(bNode.next()), null, "starting with nonexistent next")
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
    t.equal(nextNonCommentNode(aNode.first), colorNode)
    t.equal(nextNonCommentNode(colorNode.next()), null)
  })
  planned += 2

  t.plan(planned)
})
