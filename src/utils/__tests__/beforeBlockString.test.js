import beforeBlockString from "../beforeBlockString"
import postcss from "postcss"
import sugarss from "sugarss"

it("beforeBlockString rules", () => {
  expect(postcssCheck("a {}")).toBe("a ")
  expect(postcssCheck("\na\n{}")).toBe("\na\n")
  expect(postcssCheck("\n\na,\nb,\n\tspan > .foo\n{}")).toBe("\n\na,\nb,\n\tspan > .foo\n")
})

it("beforeBlockString at-rules", () => {
  expect(postcssCheck("@media print {}")).toBe("@media print ")
  expect(postcssCheck("\n@media print, screen\n\t{}")).toBe("\n@media print, screen\n\t")
  expect(postcssCheck("@supports (animation-name: test) {}")).toBe("@supports (animation-name: test) ")
  expect(postcssCheck(
    "@document url(http://www.w3.org/),\n " +
      "url-prefix(http://www.w3.org/Style/),\n" +
      "domain(mozilla.org),\n" +
      "regexp(\"https:.*\") {}")).toBe("@document url(http://www.w3.org/),\n " +
    "url-prefix(http://www.w3.org/Style/),\n" +
    "domain(mozilla.org),\n" +
    "regexp(\"https:.*\") ")
})

it("beforeBlockString with noRawBefore", () => {
  expect(postcssCheck({ noRawBefore: true }, "\na {}")).toBe("a ")
  expect(postcssCheck({ noRawBefore: true }, "\n@media print {}")).toBe("@media print ")
})

it("beforeBlockString with declaration directly at root", () => {
  expect(postcssCheck("foo: bar;")).toBe("")
})

it("beforeBlockString with comment after selector", () => {
  expect(postcssCheck("a /* x */\n{}")).toBe("a /* x */\n")
})

it("beforeBlockString without brackets using SugarSS parser", () => {
  expect(postcssCheck({ noRawBefore: true }, ".a", sugarss)).toBe(".a")
})

function postcssCheck(options = {}, cssString, parser = postcss) {
  if (typeof options === "string") {
    cssString = options
  }
  const root = parser.parse(cssString)
  return beforeBlockString(root.first, options)
}
