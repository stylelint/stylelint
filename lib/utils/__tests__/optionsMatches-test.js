"use strict"

const optionsMatches = require("../optionsMatches")
const test = require("tape")

test("optionsMatches matches a string", t => {
  t.ok(optionsMatches({ foo: "bar" }, "foo", "bar"))
  t.ok(optionsMatches({ foo: "bar" }, "foo", "BAR"))

  t.notOk(optionsMatches("not an object", "foo", "bar"))
  t.notOk(optionsMatches({ baz: "bar" }, "foo", "bar"))
  t.notOk(optionsMatches({ foo: "100" }, "foo", 100))
  t.notOk(optionsMatches({ foo: "baz" }, "foo", "bar"))

  t.ok(optionsMatches({ foo: [ "baz", "bar" ] }, "foo", "bar"))
  t.notOk(optionsMatches({ foo: [ "baz", "qux" ] }, "foo", "bar"))

  t.end()
})

test("optionsMatches matches a RegExp", t => {
  t.ok(optionsMatches({ foo: "/\\.bar/" }, "foo", ".bar"))
  t.notOk(optionsMatches({ foo: "/\\.baz$/" }, "foo", ".bar"))

  t.ok(optionsMatches({ foo: "/[a-z]+/" }, "foo", "BAR"), "input to lower case")
  t.notOk(optionsMatches({ foo: "/[A-Z]+/" }, "foo", "BAR"), "input to lower case")

  t.ok(optionsMatches({ foo: [ "/\\.bar$/", ".baz" ] }, "foo", ".bar"))
  t.ok(optionsMatches({ foo: [ "/\\.bar$/", ".baz" ] }, "foo", ".baz"))
  t.notOk(optionsMatches({ foo: [ "/\\.bar$/", "qux" ] }, "foo", ".baz"))

  t.end()
})
