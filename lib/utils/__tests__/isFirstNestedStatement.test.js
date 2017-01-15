/* @flow */
"use strict"

const isFirstNestedStatement = require("../isFirstNestedStatement")
const postcss = require("postcss")

describe("isFirstNestedStatement", () => {
  it("returns false with the first node", () => {
    const root = postcss.parse(`
      a { color: 'pink'; }
    `)
    expect(isFirstNestedStatement(root.nodes[0])).toBe(false)
  })

  it("returns true with the first-nested rule", () => {
    const root = postcss.parse(`
      @media (min-width: 0px) {
        a { color: 'pink'; }
      }
    `)

    root.walkRules((rule) => {
      expect(isFirstNestedStatement(rule)).toBe(true)
    })
  })

  it("returns true with the first-nested at-rule", () => {
    const root = postcss.parse(`
      a {
        @include foo;
      }
    `)

    root.walkAtRules((atRule) => {
      expect(isFirstNestedStatement(atRule)).toBe(true)
    })
  })

  it("returns false with first-nested non-statement", () => {
    const root = postcss.parse(`
      a {
        /* comment */
      }
    `)

    root.walkComments((comment) => {
      expect(isFirstNestedStatement(comment)).toBe(false)
    })
  })

  it("returns false with not-first-nested rule", () => {
    const root = postcss.parse(`
      @media (min-width: 0px) {
        a { color: 'pink'; }
        b { color: 'pink'; }
      }
    `)

    root.walkRules("b", (rule) => {
      expect(isFirstNestedStatement(rule)).toBe(false)
    })
  })

  it("returns false with not-first-nested at-rule", () => {
    const root = postcss.parse(`
      a {
        @include foo;
        @expect bar;
      }
    `)

    root.walkAtRules("expect", (atRule) => {
      expect(isFirstNestedStatement(atRule)).toBe(false)
    })
  })
})
