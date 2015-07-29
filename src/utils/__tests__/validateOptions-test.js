import test from "tape"
import sinon from "sinon"
import validateOptions from "../validateOptions"

function mockResult() {
  return { warn: sinon.spy() }
}

test("validateOptions for primary options", t => {
  const result = mockResult()

  validateOptions({
    result,
    ruleName: "foo",
    possible: [ "a", "b", "c" ],
    actual: "a",
  })
  t.notOk(result.warn.calledOnce, "passing string equivalence")
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "foo",
    possible: [ "a", "b", "c" ],
    actual: "d",
  })
  t.ok(result.warn.calledOnce, "failing string equivalence")
  t.ok(result.warn.calledWithMatch({
    message: "Invalid option value \"d\" for rule \"foo\"",
  }))
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "foo",
    possible: [ true, false ],
    actual: false,
  })
  t.notOk(result.warn.calledOnce, "passing boolean equivalence")
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "foo",
    possible: [ true, false ],
    actual: "a",
  })
  t.ok(result.warn.calledOnce, "failing boolean equivalence")
  t.ok(result.warn.calledWithMatch({
    message: "Invalid option value \"a\" for rule \"foo\"",
  }))
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "bar",
    possible: [ "a", x => x > 2, "c" ],
    actual: 3,
  })
  t.notOk(result.warn.calledOnce, "passing evaluation")
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "bar",
    possible: [ "a", x => x > 2, "c" ],
    actual: 1,
  })
  t.ok(result.warn.calledOnce, "failing evaluation")
  t.ok(result.warn.calledWithMatch({
    message: "Invalid option value \"1\" for rule \"bar\"",
  }))
  result.warn.reset()

  t.end()
})

test("validateOptions for secondary options objects", t => {
  const result = mockResult()

  const schema = {
    foo: [ "always", "never" ],
    bar: [ x => typeof x === "number", "tab" ],
  }

  validateOptions({
    result,
    ruleName: "foo",
    possible: schema,
    actual: { foo: "always", bar: 2 },
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "foo",
    possible: schema,
    actual: { foo: "never", bar: "tab" },
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "bar",
    possible: schema,
    actual: { foo: "neveer", bar: false },
  })
  t.ok(result.warn.calledTwice)
  t.ok(result.warn.calledWithMatch({
    message: "Invalid value \"neveer\" for option \"foo\" of rule \"bar\"",
  }))
  t.ok(result.warn.calledWithMatch({
    message: "Invalid value \"false\" for option \"bar\" of rule \"bar\"",
  }))
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "bar",
    possible: schema,
    actual: { foo: "never", barr: 1 },
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWithMatch({
    message: "Invalid option name \"barr\" for rule \"bar\"",
  }))
  result.warn.reset()

  t.end()
})

test("validateOptions for secondary options objects with subarrays", t => {
  const result = mockResult()

  const schema = {
    bar: [ "one", "two", "three", "four" ],
  }

  validateOptions({
    result,
    ruleName: "foo",
    possible: schema,
    actual: { bar: [ "one", "three" ] },
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "foo",
    possible: schema,
    actual: { bar: [ "one", "three", "floor" ] },
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWithMatch({
    message: "Invalid value \"floor\" for option \"bar\" of rule \"foo\"",
  }))
  result.warn.reset()

  t.end()
})

test("validateOptions for `*-no-*` rule with no options", t => {
  const result = mockResult()

  validateOptions({
    result,
    ruleName: "no-dancing",
    possible: [],
    actual: undefined,
  })
  t.notOk(result.warn.called)
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "no-dancing",
    possible: [],
    actual: "foo",
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWithMatch({
    message: "Invalid option value \"foo\" for rule \"no-dancing\"",
  }))
  result.warn.reset()

  validateOptions({
    result,
    ruleName: "no-dancing",
    possible: [],
    actual: false,
  })
  t.ok(result.warn.calledOnce)
  t.ok(result.warn.calledWithMatch({
    message: "Invalid option value \"false\" for rule \"no-dancing\"",
  }))
  result.warn.reset()

  t.end()
})
