/* @flow */
"use strict"

const isSharedLineComment = require("../isSharedLineComment")
const postcss = require("postcss")

describe("isSharedLineComment", () => {
  it("returns false for the first node", () => {
    const root = postcss.parse(`
      /* comment */
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(false)
  })

  it("returns false for a non-shared-line comment before a rule", () => {
    const root = postcss.parse(`
      /* comment */
      a {}
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(false)
  })

  it("returns false for a non-shared-line comment after a rule", () => {
    const root = postcss.parse(`
      a {}
      /* comment */
    `)
    expect(isSharedLineComment(root.nodes[1])).toBe(false)
  })

  it("returns true for a shared-line comment before a rule", () => {
    const root = postcss.parse(`
      /* comment */ a {}
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(true)
  })

  it("returns true for a shared-line comment after a rule", () => {
    const root = postcss.parse(`
      a {} /* comment */
    `)
    expect(isSharedLineComment(root.nodes[1])).toBe(true)
  })

  it("returns false for a shared-line non-comment", () => {
    const root = postcss.parse(`
      a {} b {}
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(false)
    expect(isSharedLineComment(root.nodes[1])).toBe(false)
  })

  it("returns true when comment shares a line with the start of a rule block, before it", () => {
    const root = postcss.parse(`
      /* comment */ a {
        color: pink;
      }
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(true)
  })

  it("returns true when comment shares a line with the start of a rule block, after it", () => {
    const root = postcss.parse(`
      a { /* comment */
        color: pink;
      }
    `)
    root.walkComments((comment) => {
      expect(isSharedLineComment(comment)).toBe(true)
    })
  })

  it("returns true when comment shares a line with the start of an at-rule block, before it", () => {
    const root = postcss.parse(`
      /* comment */ @media {@media (min-width: 0px)
        a { color: pink; }
      }
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(true)
  })

  it("returns true when comment shares a line with the start of an at-rule block, after it", () => {
    const root = postcss.parse(`
      @media (min-width: 0px) { /* comment */
        a { color: pink; }
      }
    `)
    root.walkComments((comment) => {
      expect(isSharedLineComment(comment)).toBe(true)
    })
  })

  it("returns false when comment shares a line with only another comment", () => {
    const root = postcss.parse(`
      /* comment */ /* comment */
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(false)
  })

  it("returns true when comment shares a line with another comment and a non-comment", () => {
    const root = postcss.parse(`
      /* comment */ /* comment */ a {}
    `)
    expect(isSharedLineComment(root.nodes[0])).toBe(true)
  })
})
