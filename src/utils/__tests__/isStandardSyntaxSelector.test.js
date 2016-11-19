import isStandardSyntaxSelector from "../isStandardSyntaxSelector"

it("isStandardSyntaxSelector", () => {
  expect(isStandardSyntaxSelector("a")).toBeTruthy()
  expect(isStandardSyntaxSelector(".a")).toBeTruthy()
  expect(isStandardSyntaxSelector("[a=a]")).toBeTruthy()
  expect(isStandardSyntaxSelector("*")).toBeTruthy()
  expect(isStandardSyntaxSelector("a:last-child")).toBeTruthy()
  expect(isStandardSyntaxSelector("a:not(.b)")).toBeTruthy()
  expect(isStandardSyntaxSelector("a::after")).toBeTruthy()
  expect(isStandardSyntaxSelector("a.b")).toBeTruthy()
  expect(isStandardSyntaxSelector("a > b")).toBeTruthy()
  expect(isStandardSyntaxSelector("a, b")).toBeTruthy()
  expect(isStandardSyntaxSelector("#{50% - $n}")).toBeFalsy()
  expect(isStandardSyntaxSelector(".n-#{$n}")).toBeFalsy()
  expect(isStandardSyntaxSelector(":n-#{$n}")).toBeFalsy()
  expect(isStandardSyntaxSelector(".n-@{n}")).toBeFalsy()
  expect(isStandardSyntaxSelector("%foo")).toBeFalsy()
})
