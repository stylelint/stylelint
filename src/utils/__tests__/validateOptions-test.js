import sinon from "sinon"
import test from "tape"
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

  validateOptions(result, "foo", {
    possible: schema,
    actual: 2,
  })
  t.ok(result.warn.calledOnce, "possible is actual but actual is non-object")
  t.ok(result.warn.calledWith("Invalid option value 2 for rule \"foo\": should be an object"))
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

  const invalidOptions = validateOptions(result, "foo", {
    possible: [ "one", "two" ],
    actual: "onne",
  }, {
    possible: [ "three", "four" ],
    actual: "threee",
  })
  t.equal(invalidOptions, false)
  t.ok(result.warn.calledTwice)
  t.ok(result.warn.calledWith("Invalid option value \"onne\" for rule \"foo\""))
  t.ok(result.warn.calledWith("Invalid option value \"threee\" for rule \"foo\""))
  result.warn.reset()

  t.end()
})

test("validateOptions with a function for 'possible'", t => {
  const result = mockResult()
  const schema = x => {
    if (x === "bar") { return true }
    if (!Array.isArray(x)) { return false }
    if (x.every(item => typeof item === "string" || !!item.properties)) { return true }
    return false
  }

  const validExplicitlyNamedString = validateOptions(result, "foo", {
    possible: schema,
    actual: "bar",
  })
  t.equal(validExplicitlyNamedString, true, "explicitly named string passes")
  t.notOk(result.warn.called)
  result.warn.reset()

  const validArrayOfStrings = validateOptions(result, "foo", {
    possible: schema,
    actual: [ "one", "two", "three" ],
  })
  t.equal(validArrayOfStrings, true, "array of strings passes")
  t.notOk(result.warn.called)
  result.warn.reset()

  const validArrayOfObjects = validateOptions(result, "foo", {
    possible: schema,
    actual: [
      { properties: ["one"] },
      { properties: [ "two", "three" ] },
    ],
  })
  t.equal(validArrayOfObjects, true, "array of objects passes")
  t.notOk(result.warn.called)
  result.warn.reset()

  const validArrayOfObjectsAndStrings = validateOptions(result, "foo", {
    possible: schema,
    actual: [
      { properties: ["one"] },
      { properties: [ "two", "three" ] },
      "four",
    ],
  })
  t.equal(validArrayOfObjectsAndStrings, true, "array of mixed objects and strings passes")
  t.notOk(result.warn.called)
  result.warn.reset()

  const invalidObject = validateOptions(result, "foo", {
    possible: schema,
    actual: { properties: ["one"] },
  })
  t.equal(invalidObject, false, "invalid object fails")
  t.ok(result.warn.calledOnce)
  t.equal(result.warn.args[0][0], "Invalid option \"{\"properties\":[\"one\"]}\" for rule foo")
  result.warn.reset()

  t.end()
})

test("validateOptions for null instead of array", t => {
  const result = mockResult()
  validateOptions(result, "no-dancing", {
    actual: null,
    possible: [(v) => typeof v === "string"],
  })
  t.notOk(result.warn.called)
  t.end()
})

test("validateOptions for arrayed null instead of array", t => {
  const result = mockResult()
  validateOptions(result, "no-dancing", {
    actual: [null],
    possible: [(v) => typeof v === "string"],
  })
  t.notOk(result.warn.called)
  t.end()
})
