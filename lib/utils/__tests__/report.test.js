"use strict"

const report = require("../report")
const sinon = require("sinon")

it("without disabledRanges", () => {
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
  expect(spyArgs[0]).toBe("bar")
  expect(spyArgs[1].node).toBe(v.node)
})

it("with irrelevant general disabledRange", () => {
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
  expect(spyArgs[0]).toBe("bar")
  expect(spyArgs[1].node).toBe(v.node)
})

it("with relevant general disabledRange", () => {
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
  expect(v.result.warn.called).toBeFalsy()
})

it("with irrelevant rule-specific disabledRange", () => {
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
  expect(spyArgs[0]).toBe("bar")
  expect(spyArgs[1].node).toBe(v.node)
})

it("with relevant rule-specific disabledRange", () => {
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
  expect(v.result.warn.called).toBeFalsy()
})

it("with relevant general disabledRange, among others", () => {
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
  expect(v.result.warn.called).toBeFalsy()
})

it("with relevant rule-specific disabledRange, among others", () => {
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
  expect(v.result.warn.called).toBeFalsy()
})

it("with quiet mode on and rule severity of 'warning'", () => {
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
  expect(v.result.warn.called).toBeFalsy()
})

it("with quiet mode on and rule severity of 'error'", () => {
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
  expect(v.result.warn.called).toBeTruthy()
})
