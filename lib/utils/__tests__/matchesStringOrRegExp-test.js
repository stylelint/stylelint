"use strict"

const matchesStringOrRegExp = require("../matchesStringOrRegExp")
const test = require("tape")

test("matchesStringOrRegExp comparing with string comparisonValues", t => {
  t.deepEqual(matchesStringOrRegExp("bar", "bar"), { match: "bar", pattern: "bar" })
  t.notOk(matchesStringOrRegExp("bar", "/bar something"))
  t.deepEqual(matchesStringOrRegExp("/bar something", "/bar something"), { match: "/bar something", pattern: "/bar something" })
  t.deepEqual(matchesStringOrRegExp("bar something/", "bar something/"), { match: "bar something/", pattern: "bar something/" })
  t.notOk(matchesStringOrRegExp("bar something/", "bar something//"))

  t.deepEqual(matchesStringOrRegExp([ "foo", "bar" ], "bar"), { match: "bar", pattern: "bar" })
  t.notOk(matchesStringOrRegExp([ "foo", "baz" ], "bar"))

  t.deepEqual(matchesStringOrRegExp("bar", [ "foo", "bar" ]), { match: "bar", pattern: "bar" })
  t.notOk(matchesStringOrRegExp("bar", [ "foo", "baz" ]))

  t.deepEqual(matchesStringOrRegExp([ "foo", "baz" ], [ "foo", "bar" ]), { match: "foo", pattern: "foo" })
  t.notOk(matchesStringOrRegExp([ "bar", "hooha" ], [ "foo", "baz" ]))

  t.end()
})

test("matchesStringOrRegExp comparing with a RegExp comparisonValue", t => {
  t.deepEqual(matchesStringOrRegExp(".foo", "/\\.foo$/"), { match: ".foo", pattern: "/\\.foo$/" })
  t.deepEqual(matchesStringOrRegExp("bar .foo", "/\\.foo$/"), { match: "bar .foo", pattern: "/\\.foo$/" })
  t.notOk(matchesStringOrRegExp("bar .foo bar", "/\\.foo$/"))
  t.notOk(matchesStringOrRegExp("foo", "/\\.foo$/"))

  t.deepEqual(matchesStringOrRegExp([ ".foo", "bar" ], "/\\.foo$/"), { match: ".foo", pattern: "/\\.foo$/" })
  t.notOk(matchesStringOrRegExp([ "foo", "baz" ], "/\\.foo$/"))

  t.deepEqual(matchesStringOrRegExp(".foo", [ "/\\.foo$/", "/^bar/" ]), { match: ".foo", pattern: "/\\.foo$/" })
  t.deepEqual(matchesStringOrRegExp("bar", [ "/\\.foo$/", "/^bar/" ]), { match: "bar", pattern: "/^bar/" })
  t.notOk(matchesStringOrRegExp("ebarz", [ "/\\.foo$/", "/^bar/" ]))

  t.deepEqual(matchesStringOrRegExp([ ".foo", "ebarz" ], [ "/\\.foo$/", "/^bar/" ]), { match: ".foo", pattern: "/\\.foo$/" })
  t.deepEqual(matchesStringOrRegExp([ "bar", "foo" ], [ "/\\.foo$/", "/^bar/" ]), { match: "bar", pattern: "/^bar/" })
  t.notOk(matchesStringOrRegExp([ "ebarz", "foo" ], [ "/\\.foo$/", "/^bar/" ]))

  t.end()
})
