import test from "tape"
import isStandardUrl from "../isStandardUrl"

test("isStandardValue", t => {
  t.ok(
    isStandardUrl("http://domain.com:8080/path/to@to/file@2x.ext?@1=@2"),
    "URL with protocol(http)"
  )
  t.ok(
    isStandardUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'"),
    "URL with protocol(http)"
  )
  t.ok(
    isStandardUrl("\"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2\""),
    "URL with protocol(http)"
  )

  t.notOk(isStandardUrl("$sass-variable"), "SCSS var as whole URL")
  t.notOk(isStandardUrl("@less-variable"), "Less var as whole URL")

  t.notOk(isStandardUrl("'foo' + $sass-variable"), "SCSS var concatenated to string")
  t.notOk(isStandardUrl("\"foo\" + $sass-variable"), "SCSS var concatenated to double-quoted string")
  t.notOk(isStandardUrl("$sass-variable + 'foo'"), "string concatenated to SCSS var")
  t.notOk(isStandardUrl("$sass-variable + \"foo\""), "string concatenated to SCSS var")
  t.notOk(isStandardUrl("$sass-variable + $sass-variable"), "SCSS var concatenated to SCSS var")

  t.notOk(isStandardUrl("'foo' + @less-variable"), "Less var concatenated to string")
  t.notOk(isStandardUrl("\"foo\" + @less-variable"), "Less var concatenated to double-quoted string")
  t.notOk(isStandardUrl("@less-variable + 'foo'"), "string concatenated to Less var")
  t.notOk(isStandardUrl("@less-variable + \"foo\""), "string concatenated to Less var")
  t.notOk(isStandardUrl("@less-variable + @less-variable"), "Less var concatenated to Less var")

  t.notOk(isStandardUrl("'#{$var}/images/image.png'"), "SCSS interpolation")
  t.notOk(isStandardUrl("\"#{$var}/images/image.png\""), "SCSS interpolation")
  t.notOk(isStandardUrl("'images/#{$var}/image.png'"), "SCSS interpolation")
  t.notOk(isStandardUrl("\"images/#{$var}/image.png\""), "SCSS interpolation")

  t.notOk(isStandardUrl("'@{var}/images/image.png"), "Less interpolation")
  t.notOk(isStandardUrl("\"@{var}/images/image.png\""), "Less interpolation")
  t.notOk(isStandardUrl("'images/@{var}/image.png"), "Less interpolation")
  t.notOk(isStandardUrl("\"images/@{var}/image.png\""), "Less interpolation")

  t.end()
})
