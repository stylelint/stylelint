import getUnitFromValueNode from "../getUnitFromValueNode"
import test from "tape"
import valueParser from "postcss-value-parser"

test("getUnitFromValueNode", t => {
  t.equal(getUnitFromValueNode(), null)
  t.equal(getUnitFromValueNode({}), null)
  t.equal(getUnitFromValueNode(valueParser("1px").nodes[0]), "px")
  t.equal(getUnitFromValueNode(valueParser("1pX").nodes[0]), "pX")
  t.equal(getUnitFromValueNode(valueParser("1PX").nodes[0]), "PX")
  t.equal(getUnitFromValueNode(valueParser(".1s").nodes[0]), "s")
  t.equal(getUnitFromValueNode(valueParser("100%").nodes[0]), "%")
  t.equal(getUnitFromValueNode(valueParser("100").nodes[0]), "")
  t.equal(getUnitFromValueNode(valueParser("0\\0").nodes[0]), "")
  t.equal(getUnitFromValueNode(valueParser("10px\\9").nodes[0]), "px")
  t.equal(getUnitFromValueNode(valueParser("#fff").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("#000").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("\"100\"").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser(" ").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("/").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("+").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("word").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("px").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("url()").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("$variable").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("${$variable}").nodes[0]), null)
  t.equal(getUnitFromValueNode(valueParser("@variable").nodes[0]), null)
  t.end()
})
