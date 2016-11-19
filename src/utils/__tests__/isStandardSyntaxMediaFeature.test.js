import isStandardSyntaxMediaFeature from "../isStandardSyntaxMediaFeature"

it("isStandardSyntaxMediaFeature", () => {
  expect(isStandardSyntaxMediaFeature("(min-width: 10px)")).toBeTruthy()
  expect(isStandardSyntaxMediaFeature("(width <= 3rem)")).toBeTruthy()
  expect(isStandardSyntaxMediaFeature("(400px < width < 1000px)")).toBeTruthy()
  expect(isStandardSyntaxMediaFeature("(color)")).toBeTruthy()
  expect(isStandardSyntaxMediaFeature("(min-width: calc(100% - 20px))")).toBeFalsy()
  expect(isStandardSyntaxMediaFeature("(min-width: ($var - 10px))")).toBeFalsy()
  expect(isStandardSyntaxMediaFeature("(min-width#{$value}: 10px)")).toBeFalsy()
  expect(isStandardSyntaxMediaFeature("(@{value}min-width : 10px)")).toBeFalsy()
})
