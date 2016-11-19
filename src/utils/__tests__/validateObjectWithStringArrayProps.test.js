import test from "tape"
import validateObjectWithStringArrayProps from "../validateObjectWithStringArrayProps"

test("validateObjectWithStringArrayProps", t => {
  t.ok(validateObjectWithStringArrayProps({ prop: ["val"] }))
  t.ok(validateObjectWithStringArrayProps({ prop: [ "val1", "val2", "val3" ] }))
  t.ok(validateObjectWithStringArrayProps({
    prop1: ["val1"],
    prop2: [ "val21", "val22" ],
    prop3: [ "val31", "val32", "val33" ],
  }))

  t.notOk(validateObjectWithStringArrayProps({ prop: 1 }))
  t.notOk(validateObjectWithStringArrayProps({ prop: "string" }))
  t.notOk(validateObjectWithStringArrayProps({ prop: null }))
  t.notOk(validateObjectWithStringArrayProps({ prop: { } }))

  t.notOk(validateObjectWithStringArrayProps({ prop: [ "1", 1 ] }))
  t.notOk(validateObjectWithStringArrayProps({ prop: [ "null", null ] }))
  t.notOk(validateObjectWithStringArrayProps({ prop: [ "object", { } ] }))

  t.notOk(validateObjectWithStringArrayProps({ prop1: ["1"], prop2: [ "1", 1 ] }))
  t.notOk(validateObjectWithStringArrayProps({ prop1: ["1"], prop2: [ "null", null ] }))
  t.notOk(validateObjectWithStringArrayProps({ prop1: ["1"], prop2: [ "object", { } ] }))

  t.end()
})
