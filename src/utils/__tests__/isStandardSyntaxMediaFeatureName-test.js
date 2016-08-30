import isStandardSyntaxMediaFeatureName from "../isStandardSyntaxMediaFeatureName"
import test from "tape"

test("isStandardSyntaxMediaFeatureName", t => {
  t.ok(isStandardSyntaxMediaFeatureName("min-width"), "keyword")
  t.ok(isStandardSyntaxMediaFeatureName("-webkit-min-device-pixel-ratio"), "keyword")
  t.ok(isStandardSyntaxMediaFeatureName("--viewport-medium"), "custom media query")
  t.notOk(isStandardSyntaxMediaFeatureName("$sass-variable"), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("min-width + $value"), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("$value + min-width"), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("'min-width + $value'"), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("'$value + min-width'"), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("\"min-width + $value\""), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("\"$value + min-width\""), "scss var")
  t.notOk(isStandardSyntaxMediaFeatureName("min-width#{$value}"), "scss interpolation")
  t.notOk(isStandardSyntaxMediaFeatureName("#{$value}min-width"), "scss interpolation")
  t.notOk(isStandardSyntaxMediaFeatureName("'min-width#{$value}'"), "scss interpolation")
  t.notOk(isStandardSyntaxMediaFeatureName("'#{$value}min-width'"), "scss interpolation")
  t.notOk(isStandardSyntaxMediaFeatureName("\"min-width#{$value}\""), "scss interpolation")
  t.notOk(isStandardSyntaxMediaFeatureName("\"#{$value}min-width\""), "scss interpolation")

  t.end()
})
