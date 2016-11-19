import isStandardSyntaxValue from "../isStandardSyntaxValue"

it("isStandardSyntaxValue", () => {
  expect(isStandardSyntaxValue("initial")).toBeTruthy()
  expect(isStandardSyntaxValue("currentColor")).toBeTruthy()
  expect(isStandardSyntaxValue("10px")).toBeTruthy()
  expect(isStandardSyntaxValue("45deg")).toBeTruthy()
  expect(isStandardSyntaxValue("$sass-variable")).toBeFalsy()
  expect(isStandardSyntaxValue("@less-variable")).toBeFalsy()
  expect(isStandardSyntaxValue("#{$var}")).toBeFalsy()
  expect(isStandardSyntaxValue("@{var}")).toBeFalsy()
})
