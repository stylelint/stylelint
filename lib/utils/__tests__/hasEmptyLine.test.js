"use strict"

const hasEmptyLine = require("../hasEmptyLine")

it("hasEmptyLine", () => {
  expect(hasEmptyLine("\n\n")).toBeTruthy()
  expect(hasEmptyLine("\r\n\r\n")).toBeTruthy()
  expect(hasEmptyLine("\n\n\n\n")).toBeTruthy()
  expect(hasEmptyLine("\r\n\r\n\r\n\r\n")).toBeTruthy()
  expect(hasEmptyLine("   \n\n")).toBeTruthy()
  expect(hasEmptyLine("\n\n   \n\n")).toBeTruthy()
  expect(hasEmptyLine("")).toBeFalsy()
  expect(hasEmptyLine(" ")).toBeFalsy()
  expect(hasEmptyLine("\t")).toBeFalsy()
  expect(hasEmptyLine("\n")).toBeFalsy()
  expect(hasEmptyLine("\r\n")).toBeFalsy()
})
