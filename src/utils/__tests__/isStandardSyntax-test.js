import isStandardSyntaxUrl from "../isStandardSyntaxUrl"
import test from "tape"

test("isStandardSyntaxValue", t => {
  t.ok(
    isStandardSyntaxUrl("http://domain.com:8080/path/to@to/file@2x.ext?@1=@2"),
    "URL with protocol(http)"
  )
  t.ok(
    isStandardSyntaxUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'"),
    "URL with protocol(http)"
  )
  t.ok(
    isStandardSyntaxUrl("\"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2\""),
    "URL with protocol(http)"
  )

  t.notOk(isStandardSyntaxUrl("$sass-variable"), "SCSS var as whole URL")
  t.notOk(isStandardSyntaxUrl("@less-variable"), "Less var as whole URL")

  t.notOk(isStandardSyntaxUrl("'foo' + $sass-variable"), "SCSS var concatenated to string")
  t.notOk(isStandardSyntaxUrl("\"foo\" + $sass-variable"), "SCSS var concatenated to double-quoted string")
  t.notOk(isStandardSyntaxUrl("$sass-variable + 'foo'"), "string concatenated to SCSS var")
  t.notOk(isStandardSyntaxUrl("$sass-variable + \"foo\""), "string concatenated to SCSS var")
  t.notOk(isStandardSyntaxUrl("$sass-variable + $sass-variable"), "SCSS var concatenated to SCSS var")

  t.notOk(isStandardSyntaxUrl("'foo' + @less-variable"), "Less var concatenated to string")
  t.notOk(isStandardSyntaxUrl("\"foo\" + @less-variable"), "Less var concatenated to double-quoted string")
  t.notOk(isStandardSyntaxUrl("@less-variable + 'foo'"), "string concatenated to Less var")
  t.notOk(isStandardSyntaxUrl("@less-variable + \"foo\""), "string concatenated to Less var")
  t.notOk(isStandardSyntaxUrl("@less-variable + @less-variable"), "Less var concatenated to Less var")

  t.notOk(isStandardSyntaxUrl("'#{$var}/images/image.png'"), "SCSS interpolation")
  t.notOk(isStandardSyntaxUrl("\"#{$var}/images/image.png\""), "SCSS interpolation")
  t.notOk(isStandardSyntaxUrl("'images/#{$var}/image.png'"), "SCSS interpolation")
  t.notOk(isStandardSyntaxUrl("\"images/#{$var}/image.png\""), "SCSS interpolation")

  t.notOk(isStandardSyntaxUrl("'@{var}/images/image.png"), "Less interpolation")
  t.notOk(isStandardSyntaxUrl("\"@{var}/images/image.png\""), "Less interpolation")
  t.notOk(isStandardSyntaxUrl("'images/@{var}/image.png"), "Less interpolation")
  t.notOk(isStandardSyntaxUrl("\"images/@{var}/image.png\""), "Less interpolation")

  t.end()
})
