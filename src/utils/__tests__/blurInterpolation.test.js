import blurInterpolation from "../blurInterpolation"

it("blurInterpolation", () => {
  expect(blurInterpolation("#{$selector}")).toBe(" $selector ")
  expect(blurInterpolation("#{$selector}", "`")).toBe("`$selector`")
  expect(blurInterpolation("#{$selector * 10px}")).toBe(" $selector * 10px ")
  expect(blurInterpolation("#{$font-size}/#{$line-height}")).toBe(" $font-size / $line-height ")
  expect(blurInterpolation("url(#{$selector * 10px})")).toBe("url( $selector * 10px )")
  expect(blurInterpolation("calc(#{$selector} * 2)")).toBe("calc( $selector  * 2)")
  expect(blurInterpolation(
    "filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr='#{ie-hex-str($green)}', endColorstr='#{ie-hex-str($translucent-red)}');")).toBe(
    "filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr=' ie-hex-str($green) ', endColorstr=' ie-hex-str($translucent-red) ');"
  )
  expect(blurInterpolation("\"I ate #{5 + 10} pies!\"")).toBe("\"I ate  5 + 10  pies!\"")
  expect(blurInterpolation("@{variable}")).toBe(" variable ")
})
