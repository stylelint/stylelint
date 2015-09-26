import test from "tape"
import postcss from "postcss"
import cssStatementStringBeforeBlock from "../cssStatementStringBeforeBlock"

test("cssStatementStringBeforeBlock rules", t => {
  t.equal(postcssCheck("a {}"), "a ")
  t.equal(postcssCheck("\na\n{}"), "\na\n")
  t.equal(postcssCheck("\n\na,\nb,\n\tspan > .foo\n{}"), "\n\na,\nb,\n\tspan > .foo\n")
  t.end()
})

test("cssStatementStringBeforeBlock at-rules", t => {
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

test("cssStatementStringBeforeBlock with noBefore", t => {
  t.equal(postcssCheck({ noBefore: true }, "\na {}"), "a ")
  t.equal(postcssCheck({ noBefore: true }, "\n@media print {}"), "@media print ")
  t.end()
})

test("cssStatementStringBeforeBlock with declaration directly at root", t => {
  t.equal(postcssCheck("foo: bar;"), "")
  t.end()
})

function postcssCheck(options={}, cssString) {
  if (typeof options === "string") {
    cssString = options
  }
  const root = postcss.parse(cssString)
  return cssStatementStringBeforeBlock(root.first, options)
}
