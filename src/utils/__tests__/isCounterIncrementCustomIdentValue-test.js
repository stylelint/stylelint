import isCounterIncrementCustomIdentValue from "../isCounterIncrementCustomIdentValue"
import test from "tape"

test("isCustomIdents", t => {
  t.ok(isCounterIncrementCustomIdentValue("counter"))
  t.ok(isCounterIncrementCustomIdentValue("cOuNtEr"))
  t.ok(isCounterIncrementCustomIdentValue("COUNTER"))
  t.ok(isCounterIncrementCustomIdentValue("counter-name"))
  t.ok(isCounterIncrementCustomIdentValue("counter1"))
  t.ok(isCounterIncrementCustomIdentValue("counter2"))
  t.notOk(isCounterIncrementCustomIdentValue("none"))
  t.notOk(isCounterIncrementCustomIdentValue("inherit"))
  t.notOk(isCounterIncrementCustomIdentValue("initial"))
  t.notOk(isCounterIncrementCustomIdentValue("unset"))
  t.notOk(isCounterIncrementCustomIdentValue("-1"))
  t.notOk(isCounterIncrementCustomIdentValue("1"))
  t.end()
})
