import sinon from "sinon"
import validateOptions from "../validateOptions"

function mockResult() {
  return { warn: sinon.spy() }
}

it("validateOptions for primary options", () => {
  const result = mockResult()

  validateOptions(result, "foo", {
    possible: [ "a", "b", "c" ],
    actual: "a",
  })
  expect(result.warn.calledOnce).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ "a", "b", "c" ],
    actual: "d",
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(result.warn.calledWith("Invalid option value \"d\" for rule \"foo\"")).toBeTruthy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: false,
  })
  expect(result.warn.calledOnce).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: "a",
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(result.warn.calledWith("Invalid option value \"a\" for rule \"foo\"")).toBeTruthy()
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: [ "a", x => x > 2, "c" ],
    actual: 3,
  })
  expect(result.warn.calledOnce).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: [ "a", x => x > 2, "c" ],
    actual: 1,
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(result.warn.calledWith("Invalid option value \"1\" for rule \"bar\"")).toBeTruthy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: undefined,
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(result.warn.calledWith("Expected option value for rule \"foo\"")).toBeTruthy()
  result.warn.reset()
})

it("validateOptions for secondary options objects", () => {
  const result = mockResult()

  const schema = {
    foo: [ "always", "never" ],
    bar: [ x => typeof x === "number", "tab" ],
  }

  validateOptions(result, "foo", {
    possible: schema,
    actual: { foo: "always", bar: 2 },
  })
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: schema,
    actual: { foo: "never", bar: "tab" },
  })
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: schema,
    actual: { foo: "neveer", bar: false },
  })
  expect(result.warn.calledTwice).toBeTruthy()
  expect(
    result.warn.calledWith("Invalid value \"neveer\" for option \"foo\" of rule \"bar\"")
  ).toBeTruthy()
  expect(
    result.warn.calledWith("Invalid value \"false\" for option \"bar\" of rule \"bar\"")
  ).toBeTruthy()
  result.warn.reset()

  validateOptions(result, "bar", {
    possible: schema,
    actual: { foo: "never", barr: 1 },
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(result.warn.calledWith("Invalid option name \"barr\" for rule \"bar\"")).toBeTruthy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: [ true, false ],
    actual: undefined,
    optional: true,
  })
  expect(result.warn.calledOnce).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: schema,
    actual: 2,
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(
    result.warn.calledWith("Invalid option value 2 for rule \"foo\": should be an object")
  ).toBeTruthy()
  result.warn.reset()
})

it("validateOptions for secondary options objects with subarrays", () => {
  const result = mockResult()

  const schema = {
    bar: [ "one", "two", "three", "four" ],
  }

  validateOptions(result, "foo", {
    possible: schema,
    actual: { bar: [ "one", "three" ] },
  })
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "foo", {
    possible: schema,
    actual: { bar: [ "one", "three", "floor" ] },
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(
    result.warn.calledWith("Invalid value \"floor\" for option \"bar\" of rule \"foo\"")
  ).toBeTruthy()
  result.warn.reset()
})

it("validateOptions for `*-no-*` rule with no valid options", () => {
  const result = mockResult()

  validateOptions(result, "no-dancing", {
    actual: undefined,
  })
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "no-dancing", {
    actual: undefined,
  })
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  validateOptions(result, "no-dancing", {
    actual: "foo",
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(
    result.warn.calledWith("Unexpected option value \"foo\" for rule \"no-dancing\"")
  ).toBeTruthy()
  result.warn.reset()

  validateOptions(result, "no-dancing", {
    actual: false,
  })
  expect(result.warn.calledOnce).toBeTruthy()
  expect(
    result.warn.calledWith("Unexpected option value \"false\" for rule \"no-dancing\"")
  ).toBeTruthy()
  result.warn.reset()
})

it("validateOptions for multiple actual/possible pairs, checking return value", () => {
  const result = mockResult()

  const validOptions = validateOptions(result, "foo", {
    possible: [ "one", "two" ],
    actual: "one",
  }, {
    possible: [ "three", "four" ],
    actual: "three",
  })
  expect(validOptions).toBe(true)
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  const invalidOptions = validateOptions(result, "foo", {
    possible: [ "one", "two" ],
    actual: "onne",
  }, {
    possible: [ "three", "four" ],
    actual: "threee",
  })
  expect(invalidOptions).toBe(false)
  expect(result.warn.calledTwice).toBeTruthy()
  expect(result.warn.calledWith("Invalid option value \"onne\" for rule \"foo\"")).toBeTruthy()
  expect(result.warn.calledWith("Invalid option value \"threee\" for rule \"foo\"")).toBeTruthy()
  result.warn.reset()
})

it("validateOptions with a function for 'possible'", () => {
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
  expect(validExplicitlyNamedString).toBe(true)
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  const validArrayOfStrings = validateOptions(result, "foo", {
    possible: schema,
    actual: [ "one", "two", "three" ],
  })
  expect(validArrayOfStrings).toBe(true)
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  const validArrayOfObjects = validateOptions(result, "foo", {
    possible: schema,
    actual: [
      { properties: ["one"] },
      { properties: [ "two", "three" ] },
    ],
  })
  expect(validArrayOfObjects).toBe(true)
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  const validArrayOfObjectsAndStrings = validateOptions(result, "foo", {
    possible: schema,
    actual: [
      { properties: ["one"] },
      { properties: [ "two", "three" ] },
      "four",
    ],
  })
  expect(validArrayOfObjectsAndStrings).toBe(true)
  expect(result.warn.called).toBeFalsy()
  result.warn.reset()

  const invalidObject = validateOptions(result, "foo", {
    possible: schema,
    actual: { properties: ["one"] },
  })
  expect(invalidObject).toBe(false)
  expect(result.warn.calledOnce).toBeTruthy()
  expect(result.warn.args[0][0]).toBe("Invalid option \"{\"properties\":[\"one\"]}\" for rule foo")
  result.warn.reset()
})

it("validateOptions for null instead of array", () => {
  const result = mockResult()
  validateOptions(result, "no-dancing", {
    actual: null,
    possible: [(v) => typeof v === "string"],
  })
  expect(result.warn.called).toBeFalsy()
})

it("validateOptions for arrayed null instead of array", () => {
  const result = mockResult()
  validateOptions(result, "no-dancing", {
    actual: [null],
    possible: [(v) => typeof v === "string"],
  })
  expect(result.warn.called).toBeFalsy()
})
