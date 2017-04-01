"use strict"

const parseStylelintIgnore = require("../parseStylelintIgnore")
const stripIndent = require("common-tags").stripIndent

describe("parseStylelintIgnore", () => {
  it("returns an empty array when given an empty string", () => {
    expect(parseStylelintIgnore("")).toEqual([])
  })

  it("returns an empty array when given undefined", () => {
    expect(parseStylelintIgnore()).toEqual([])
  })

  it("ignores empty lines", () => {
    expect(parseStylelintIgnore(stripIndent`
      one.css

      two.css

      three.css`)).toEqual([
        "one.css",
        "two.css",
        "three.css",
      ])
  })

  it("ignores comments", () => {
    expect(parseStylelintIgnore(stripIndent`
      one.css
      #foo
      two.css
      # bar
      three.css`)).toEqual([
        "one.css",
        "two.css",
        "three.css",
      ])
  })

  it("handles \r\n newlines", () => {
    expect(parseStylelintIgnore("foo\r\n\r\nbar\r\n# comment\r\nbaz")).toEqual([
      "foo",
      "bar",
      "baz",
    ])
  })
})
