import test from "tape"
import sinon from "sinon"
import validateOptions from "../validateOptions"

function mockResult() {
  return { warn: sinon.spy() }
}

test("validateOptions for primary options", t => {
  const result = mockResult()

  validateOptions(result, "foo", {
    possible: [ "a", "b", "c" ],
    actual: "a",
  })
  t.notOk(result.warn.calledOnce, "passing string equivalence")
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ "a", "b", "c" ],
    actual: "d",
  })
  t.ok(result.warn.calledOnce, "failing string equivalence")
  t.ok(result.warn.calledWith("Invalid option value \"d\" for rule \"foo\""))
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: false,
  })
  t.notOk(result.warn.calledOnce, "passing boolean equivalence")
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: "a",
  })
  t.ok(result.warn.calledOnce, "failing boolean equivalence")
  t.ok(result.warn.calledWith("Invalid option value \"a\" for rule \"foo\""))
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: [ "a", x => x > 2, "c" ],
    actual: 3,
  })
  t.notOk(result.warn.calledOnce, "passing evaluation")
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: [ "a", x => x > 2, "c" ],
    actual: 1,
  })
  t.ok(result.warn.calledOnce, "failing evaluation")
  t.ok(result.warn.calledWith("Invalid option value \"1\" for rule \"bar\""))
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: undefined,
  })
  t.ok(result.warn.calledOnce, "undefined `actual` with `possible` values and no `optional` option")
  t.ok(result.warn.calledWith("Expected option value for rule \"foo\""))
  result.warn.reset()

  t.end()
})

test("validateOptions for secondary options objects", t => {
  const result = mockResult()

  const schema = {
    foo: [ "always", "never" ],
    bar: [ x => typeof x === "number", "tab" ],
  }

  validateOptions(result, "foo", {
    possible: schema,
    actual: { foo: "always", bar: 2 },
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: schema,
    actual: { foo: "never", bar: "tab" },
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: schema,
    actual: { foo: "neveer", bar: false },
  })
  t.ok(result.warn.calledTwice)
  t.ok(result.warn.calledWith("Invalid value \"neveer\" for option \"foo\" of rule \"bar\""))
  t.ok(result.warn.calledWith("Invalid value \"false\" for option \"bar\" of rule \"bar\""))
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: schema,
    actual: { foo: "never", barr: 1 },
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWith("Invalid option name \"barr\" for rule \"bar\""))
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: undefined,
    optional: true,
  })
  t.notOk(result.warn.calledOnce, "undefined `actual` with `possible` values and an `optional` option")
  result.warn.reset()

  t.end()
})

test("validateOptions for secondary options objects with subarrays", t => {
  const result = mockResult()

  const schema = {
    bar: [ "one", "two", "three", "four" ],
  }

  validateOptions(result, "foo", {
    possible: schema,
    actual: { bar: [ "one", "three" ] },
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: schema,
    actual: { bar: [ "one", "three", "floor" ] },
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWith("Invalid value \"floor\" for option \"bar\" of rule \"foo\""))
  result.warn.reset()

  t.end()
})

test("validateOptions for `*-no-*` rule with no valid options", t => {
  const result = mockResult()

  validateOptions(result, "no-dancing", {
    actual: undefined,
  })
  t.notOk(result.warn.called, "with empty array as `possible`")
  result.warn.reset()

  validateOptions(result, "no-dancing", {
    actual: undefined,
  })
  t.notOk(result.warn.called, "with `possible` left undefined")
  result.warn.reset()

  validateOptions(result, "no-dancing", {
    actual: "foo",
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWith("Unexpected option value \"foo\" for rule \"no-dancing\""))
  result.warn.reset()

  validateOptions(result, "no-dancing", {
    actual: false,
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWith("Unexpected option value \"false\" for rule \"no-dancing\""))
  result.warn.reset()

  t.end()
})

test("validateOptions for multiple actual/possible pairs, checking return value", t => {
  const result = mockResult()

  const validOptions = validateOptions(result, "foo", {
    possible: [ "one", "two" ],
    actual: "one",
  }, {
    possible: [ "three", "four" ],
    actual: "three",
  })
  t.equal(validOptions, true)
  t.notOk(result.warn.called)
  result.warn.reset()

  const validOptions2 = validateOptions(result, "foo", {
    possible: [ "one", "two" ],
    actual: "onne",
  }, {
    possible: [ "three", "four" ],
    actual: "threee",
  })
  t.equal(validOptions2, false)
  t.ok(result.warn.calledTwice)
  t.ok(result.warn.calledWith("Invalid option value \"onne\" for rule \"foo\""))
  t.ok(result.warn.calledWith("Invalid option value \"threee\" for rule \"foo\""))
  result.warn.reset()

  t.end()
})

test("validateOptions with `possibleArray`", t => {
  const result = mockResult()

  const validOptions = validateOptions(result, "foo", {
    possibleArray: [ "one", "two" ],
    actual: [ "one", "one", "two" ],
  })
  t.equal(validOptions, true)
  t.notOk(result.warn.called)
  result.warn.reset()

  const invalidOptions1 = validateOptions(result, "bar", {
    possibleArray: [ "three", "four" ],
    actual: "three",
  })
  t.equal(invalidOptions1, false)
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWith("Expected an array option value for rule \"bar\""))
  result.warn.reset()

  const invalidOptions2 = validateOptions(result, "bar", {
    possibleArray: [ "three", "four" ],
    actual: ["five"],
  })
  t.equal(invalidOptions2, false)
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWith("Invalid option value \"five\" for rule \"bar\""))
  result.warn.reset()

  t.end()
})
