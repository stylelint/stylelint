import isCustomIdentPropertyCounterIncrement from "../isCustomIdentPropertyCounterIncrement"
import test from "tape"

test("isCustomIdents", t => {
  t.ok(isCustomIdentPropertyCounterIncrement("counter"))
  t.ok(isCustomIdentPropertyCounterIncrement("cOuNtEr"))
  t.ok(isCustomIdentPropertyCounterIncrement("COUNTER"))
  t.ok(isCustomIdentPropertyCounterIncrement("counter-name"))
  t.ok(isCustomIdentPropertyCounterIncrement("counter1"))
  t.ok(isCustomIdentPropertyCounterIncrement("counter2"))
  t.notOk(isCustomIdentPropertyCounterIncrement("none"))
  t.notOk(isCustomIdentPropertyCounterIncrement("inherit"))
  t.notOk(isCustomIdentPropertyCounterIncrement("initial"))
  t.notOk(isCustomIdentPropertyCounterIncrement("unset"))
  t.notOk(isCustomIdentPropertyCounterIncrement("-1"))
  t.notOk(isCustomIdentPropertyCounterIncrement("1"))
  t.end()
})
