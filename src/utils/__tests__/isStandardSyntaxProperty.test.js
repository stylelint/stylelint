import isStandardSyntaxProperty from "../isStandardSyntaxProperty"

it("isStandardSyntaxProperty", () => {
  expect(isStandardSyntaxProperty("top")).toBeTruthy()
  expect(isStandardSyntaxProperty("--custom-property")).toBeTruthy()
  expect(isStandardSyntaxProperty("border-top-left-radius")).toBeTruthy()
  expect(isStandardSyntaxProperty("-webkit-appearance")).toBeTruthy()
  expect(isStandardSyntaxProperty("$sass-variable")).toBeFalsy()
  expect(isStandardSyntaxProperty("#{$Attr}-color")).toBeFalsy()
  expect(isStandardSyntaxProperty("@{Attr}-color")).toBeFalsy()
})
