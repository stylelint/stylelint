import beforeBlockString from "../beforeBlockString"
import postcss from "postcss"
import sugarss from "sugarss"
import test from "tape"

test("beforeBlockString rules", t => {
  t.equal(postcssCheck("a {}"), "a ")
  t.equal(postcssCheck("\na\n{}"), "\na\n")
  t.equal(postcssCheck("\n\na,\nb,\n\tspan > .foo\n{}"), "\n\na,\nb,\n\tspan > .foo\n")
  t.end()
})

test("beforeBlockString at-rules", t => {
  t.equal(postcssCheck("@media print {}"), "@media print ")
  t.equal(postcssCheck("\n@media print, screen\n\t{}"), "\n@media print, screen\n\t")
  t.equal(postcssCheck("@supports (animation-name: test) {}"), "@supports (animation-name: test) ")
  t.equal(postcssCheck(
    "@document url(http://www.w3.org/),\n " +
      "url-prefix(http://www.w3.org/Style/),\n" +
      "domain(mozilla.org),\n" +
      "regexp(\"https:.*\") {}"),
    "@document url(http://www.w3.org/),\n " +
      "url-prefix(http://www.w3.org/Style/),\n" +
      "domain(mozilla.org),\n" +
      "regexp(\"https:.*\") ")
  t.end()
})

test("beforeBlockString with noRawBefore", t => {
  t.equal(postcssCheck({ noRawBefore: true }, "\na {}"), "a ")
  t.equal(postcssCheck({ noRawBefore: true }, "\n@media print {}"), "@media print ")
  t.end()
})

test("beforeBlockString with declaration directly at root", t => {
  t.equal(postcssCheck("foo: bar;"), "")
  t.end()
})

test("beforeBlockString with comment after selector", t => {
  t.equal(postcssCheck("a /* x */\n{}"), "a /* x */\n")
  t.end()
})

test("beforeBlockString without brackets using SugarSS parser", t => {
  t.equal(postcssCheck({ noRawBefore: true }, ".a", sugarss), ".a")
  t.end()
})

function postcssCheck(options = {}, cssString, parser = postcss) {
  if (typeof options === "string") {
    cssString = options
  }
  const root = parser.parse(cssString)
  return beforeBlockString(root.first, options)
}
