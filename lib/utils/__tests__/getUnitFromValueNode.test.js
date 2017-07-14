"use strict";

const getUnitFromValueNode = require("../getUnitFromValueNode");
const valueParser = require("postcss-value-parser");

it("getUnitFromValueNode", () => {
  expect(getUnitFromValueNode()).toBe(null);
  expect(getUnitFromValueNode({})).toBe(null);
  expect(getUnitFromValueNode(valueParser("1px").nodes[0])).toBe("px");
  expect(getUnitFromValueNode(valueParser("1pX").nodes[0])).toBe("pX");
  expect(getUnitFromValueNode(valueParser("1PX").nodes[0])).toBe("PX");
  expect(getUnitFromValueNode(valueParser(".1s").nodes[0])).toBe("s");
  expect(getUnitFromValueNode(valueParser("100%").nodes[0])).toBe("%");
  expect(getUnitFromValueNode(valueParser("100").nodes[0])).toBe("");
  expect(getUnitFromValueNode(valueParser("0\\0").nodes[0])).toBe("");
  expect(getUnitFromValueNode(valueParser("10px\\9").nodes[0])).toBe("px");
  expect(getUnitFromValueNode(valueParser("#fff").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("#000").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser('"100"').nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser(" ").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("/").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("+").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("word").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("px").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("url()").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("$variable").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("${$variable}").nodes[0])).toBe(null);
  expect(getUnitFromValueNode(valueParser("@variable").nodes[0])).toBe(null);
});
