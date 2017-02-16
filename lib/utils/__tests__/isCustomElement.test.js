"use strict"

const isCustomElement = require("../isCustomElement")

it("isCustomElement", () => {
  expect(isCustomElement("x-foo")).toBeTruthy()
  expect(isCustomElement("math-α")).toBeTruthy()
  expect(isCustomElement("emotion-😍")).toBeTruthy()

  expect(isCustomElement("X-foo")).toBeFalsy()
  expect(isCustomElement("x-Foo")).toBeFalsy()
  expect(isCustomElement("X-FOO")).toBeFalsy()

  // Html tags
  expect(isCustomElement("div")).toBeFalsy()
  expect(isCustomElement("dIv")).toBeFalsy()
  expect(isCustomElement("DiV")).toBeFalsy()
  expect(isCustomElement("DIV")).toBeFalsy()
  expect(isCustomElement("foo")).toBeFalsy()
  expect(isCustomElement("acronym")).toBeFalsy()
  // Svg tags
  expect(isCustomElement("font-face")).toBeFalsy()
  expect(isCustomElement("clipPath")).toBeFalsy()
  // Mathml tags
  expect(isCustomElement("abs")).toBeFalsy()
  expect(isCustomElement("annotation-xml")).toBeFalsy()

  expect(isCustomElement(".foo")).toBeFalsy()
  expect(isCustomElement(".foo-bar")).toBeFalsy()
  expect(isCustomElement("#foo")).toBeFalsy()
  expect(isCustomElement("#foo-bar")).toBeFalsy()
  expect(isCustomElement(":foo")).toBeFalsy()
  expect(isCustomElement(":foo-bar")).toBeFalsy()
  expect(isCustomElement("::foo")).toBeFalsy()
  expect(isCustomElement("::foo-bar")).toBeFalsy()
})
