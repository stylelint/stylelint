import containsString from "../containsString"
import test from "tape"

test("containsString comparing with string comparison values", t => {
  t.deepEqual(containsString("bar", "bar"),
    { match: "bar", pattern: "bar" })
  t.deepEqual(containsString("foo bar something", "bar"),
    { match: "foo bar something", pattern: "bar" })
  t.notOk(containsString("bar", "foo"))
  t.deepEqual(containsString("/bar something", "/bar"),
    { match: "/bar something", pattern: "/bar" })
  t.deepEqual(containsString("bar something/", "something/"),
    { match: "bar something/", pattern: "something/" })
  t.notOk(containsString("/bar/", "/bar/"))
  t.notOk(containsString("/bar/ something", "/bar/"))
  t.notOk(containsString("bar", ""))
  t.notOk(containsString("bar", null))

  t.end()
})

test("containsString comparing with array comparison values", t => {
  t.deepEqual(containsString("bar", [ "foo", "bar" ]),
    { match: "bar", pattern: "bar" })
  t.deepEqual(containsString("foo baz something", [ "bar", "baz" ]),
    { match: "foo baz something", pattern: "baz" })
  t.deepEqual(containsString("foo bar", [ "bar", "foo" ]),
    { match: "foo bar", pattern: "bar" })
  t.notOk(containsString("bar", [ "foo", "baz" ]))
  t.notOk(containsString("/bar/", ["/bar/"]))
  t.notOk(containsString("/bar/ something", [ "/bar/", "foo" ]))
  t.notOk(containsString("bar", []))

  t.end()
})
