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

  t.notOk(isStandardUrl("$sass-variable"), "scss var")
  t.notOk(isStandardUrl("test + $sass-variable"), "scss var")
  t.notOk(isStandardUrl("test+$sass-variable"), "scss var")
  t.notOk(isStandardUrl("test $sass-variable"), "scss var")
  t.notOk(isStandardUrl("test$sass-variable"), "scss var")

  t.notOk(isStandardUrl("'test' + $sass-variable"), "scss var")
  t.notOk(isStandardUrl("'test'+$sass-variable"), "scss var")
  t.notOk(isStandardUrl("'test' $sass-variable"), "scss var")
  t.notOk(isStandardUrl("'test'$sass-variable"), "scss var")

  t.notOk(isStandardUrl("\"test\" + $sass-variable"), "scss var")
  t.notOk(isStandardUrl("\"test\"+$sass-variable"), "scss var")
  t.notOk(isStandardUrl("\"test\" $sass-variable"), "scss var")
  t.notOk(isStandardUrl("\"test\"$sass-variable"), "scss var")

  t.notOk(isStandardUrl("$sass-variable + test"), "scss var")
  t.notOk(isStandardUrl("$sass-variable+test"), "scss var")
  t.notOk(isStandardUrl("$sass-variable test"), "scss var")

  t.notOk(isStandardUrl("$sass-variable + 'test'"), "scss var")
  t.notOk(isStandardUrl("$sass-variable+'test'"), "scss var")
  t.notOk(isStandardUrl("$sass-variable 'test'"), "scss var")
  t.notOk(isStandardUrl("$sass-variable'test'"), "scss var")

  t.notOk(isStandardUrl("$sass-variable + \"test\""), "scss var")
  t.notOk(isStandardUrl("$sass-variable+\"test\""), "scss var")
  t.notOk(isStandardUrl("$sass-variable \"test\""), "scss var")
  t.notOk(isStandardUrl("$sass-variable\"test\""), "scss var")

  t.notOk(isStandardUrl("@less-variable"), "less var")

  t.notOk(isStandardUrl("'#{$var}/images/image.png'"), "scss interpolation")
  t.notOk(isStandardUrl("\"#{$var}/images/image.png\""), "scss interpolation")
  t.notOk(isStandardUrl("'images/#{$var}/image.png'"), "scss interpolation")
  t.notOk(isStandardUrl("\"images/#{$var}/image.png\""), "scss interpolation")

  t.notOk(isStandardUrl("'@{var}/images/image.png"), "less interpolation")
  t.notOk(isStandardUrl("\"@{var}/images/image.png\""), "less interpolation")
  t.notOk(isStandardUrl("'images/@{var}/image.png"), "less interpolation")
  t.notOk(isStandardUrl("\"images/@{var}/image.png\""), "less interpolation")

  t.end()
})
