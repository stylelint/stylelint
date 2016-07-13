import report from "../report"
import sinon from "sinon"
import test from "tape"

test("without disabledRanges", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 2 }),
    },
  }
  report(v)
  const spyArgs = v.result.warn.args[0]
  t.equal(spyArgs[0], "bar")
  t.equal(spyArgs[1].node, v.node)
  t.end()
})

test("with irrelevant general disabledRange", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        disabledRanges: {
          all: [{ start: 5, end: 8 }],
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 2 }),
    },
  }
  report(v)
  const spyArgs = v.result.warn.args[0]
  t.equal(spyArgs[0], "bar")
  t.equal(spyArgs[1].node, v.node)
  t.end()
})

test("with relevant general disabledRange", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        disabledRanges: {
          all: [{ start: 5, end: 8 }],
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  t.notOk(v.result.warn.called)
  t.end()
})

test("with irrelevant rule-specific disabledRange", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        disabledRanges: {
          all: [],
          bar: [{ start: 5, end: 8 }],
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  const spyArgs = v.result.warn.args[0]
  t.equal(spyArgs[0], "bar")
  t.equal(spyArgs[1].node, v.node)
  t.end()
})

test("with relevant rule-specific disabledRange", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        disabledRanges: {
          all: [],
          foo: [{ start: 5, end: 8 }],
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  t.notOk(v.result.warn.called)
  t.end()
})

test("with relevant general disabledRange, among others", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        disabledRanges: {
          all: [
            { start: 1, end: 3 },
            { start: 5, end: 8 },
          ],
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  t.notOk(v.result.warn.called)
  t.end()
})

test("with relevant rule-specific disabledRange, among others", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        disabledRanges: {
          all: [],
          foo: [
            { start: 1, end: 3, rules: ["foo"] },
            { start: 5, end: 8, rules: ["foo"] },
          ],
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  t.notOk(v.result.warn.called)
  t.end()
})

test("with quiet mode on and rule severity of 'warning'", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        quiet: true,
        ruleSeverities: {
          foo: "warning",
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  t.notOk(v.result.warn.called)
  t.end()
})

test("with quiet mode on and rule severity of 'error'", t => {
  const v = {
    ruleName: "foo",
    result: {
      warn: sinon.spy(),
      stylelint: {
        quiet: true,
        ruleSeverities: {
          foo: "error",
        },
      },
    },
    message: "bar",
    node: {
      positionBy: () => ({ line: 6 }),
    },
  }
  report(v)
  t.ok(v.result.warn.called)
  t.end()
})
