import test from "tape"
import matchesStringOrRegExp from "../matchesStringOrRegExp"

test("matchesStringOrRegExp comparing with string comparisonValues", t => {
  t.ok(matchesStringOrRegExp("bar", "bar"))
  t.notOk(matchesStringOrRegExp("bar", "/bar something"))
  t.ok(matchesStringOrRegExp("/bar something", "/bar something"))
  t.ok(matchesStringOrRegExp("bar something/", "bar something/"))
  t.notOk(matchesStringOrRegExp("bar something/", "bar something//"))

  t.ok(matchesStringOrRegExp([ "foo", "bar" ], "bar"))
  t.notOk(matchesStringOrRegExp([ "foo", "baz" ], "bar"))

  t.ok(matchesStringOrRegExp("bar", [ "foo", "bar" ]))
  t.notOk(matchesStringOrRegExp("bar", [ "foo", "baz" ]))

  t.ok(matchesStringOrRegExp([ "foo", "baz" ], [ "foo", "bar" ]))
  t.notOk(matchesStringOrRegExp([ "bar", "hooha" ], [ "foo", "baz" ]))

  t.end()
})

test("matchesStringOrRegExp comparing with a RegExp comparisonValue", t => {
  const comparisonValue = "/\\.foo$/"
  const anotherComparisonValue = "/^bar/"

  t.ok(matchesStringOrRegExp(".foo", comparisonValue))
  t.ok(matchesStringOrRegExp("bar .foo", comparisonValue))
  t.notOk(matchesStringOrRegExp("bar .foo bar", comparisonValue))
  t.notOk(matchesStringOrRegExp("foo", comparisonValue))

  t.ok(matchesStringOrRegExp([ ".foo", "bar" ], comparisonValue))
  t.notOk(matchesStringOrRegExp([ "foo", "baz" ], comparisonValue))

  t.ok(matchesStringOrRegExp(".foo", [ comparisonValue, anotherComparisonValue ]))
  t.ok(matchesStringOrRegExp("bar", [ comparisonValue, anotherComparisonValue ]))
  t.notOk(matchesStringOrRegExp("ebarz", [ comparisonValue, anotherComparisonValue ]))

  t.ok(matchesStringOrRegExp([ ".foo", "ebarz" ], [ comparisonValue, anotherComparisonValue ]))
  t.ok(matchesStringOrRegExp([ "bar", "foo" ], [ comparisonValue, anotherComparisonValue ]))
  t.notOk(matchesStringOrRegExp([ "ebarz", "foo" ], [ comparisonValue, anotherComparisonValue ]))

  t.end()
})
