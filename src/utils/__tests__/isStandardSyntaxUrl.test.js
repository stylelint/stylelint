import isStandardSyntaxUrl from "../isStandardSyntaxUrl"
import test from "tape"

test("isStandardSyntaxUrl", t => {
  t.ok(isStandardSyntaxUrl(""), "empty")
  t.ok(isStandardSyntaxUrl("some/path/to/file.png"), "path-relative url")
  t.ok(isStandardSyntaxUrl("'some/path/to/file.png'"), "path-relative with single quotes")
  t.ok(isStandardSyntaxUrl("\"some/path/to/file.png\""), "path-relative with double quotes")
  t.ok(isStandardSyntaxUrl("\"some/path/to/file.png\""), "path-relative with double quotes")
  t.ok(isStandardSyntaxUrl("/some/path/to/file.png"), "path-absolute url")
  t.ok(isStandardSyntaxUrl("//www.domain.com/file.jpg"), "protocol-relative-url")
  t.ok(isStandardSyntaxUrl("./some/path/to/file.png"), "url with single-dot path segment")
  t.ok(isStandardSyntaxUrl("../some/path/to/file.png"), "url with double-dot path segment")
  t.ok(isStandardSyntaxUrl("https://www.domain.com:8080/file.jpg"), "url with port")
  t.ok(
    isStandardSyntaxUrl(
      "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
    ),
    "url with local scheme"
  )

  t.ok(
    isStandardSyntaxUrl("http://domain.com:8080/path/to$to/file$2x.ext?$1=$2"),
    "URL with protocol(http) and `$` character without quotes"
  )
  t.ok(
    isStandardSyntaxUrl("'http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2'"),
    "URL with protocol(http) and `$` character in single quotes"
  )
  t.ok(
    isStandardSyntaxUrl("\"http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2\""),
    "URL with protocol(http) and `$` character in double quotes"
  )

  t.ok(
    isStandardSyntaxUrl("http://domain.com:8080/path/to@to/file@2x.ext?@1=@2"),
    "URL with protocol(http) and `@` character without quotes"
  )
  t.ok(
    isStandardSyntaxUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'"),
    "URL with protocol(http) and `@` character in single quotes"
  )
  t.ok(
    isStandardSyntaxUrl("\"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2\""),
    "URL with protocol(http) and `@` character in double quotes"
  )

  t.ok(isStandardSyntaxUrl("\"$url/path\""), "url with dollar at the start and double quotes")
  t.ok(isStandardSyntaxUrl("\"some/$url/path\""), "url with dollar in the middle and double quotes")
  t.ok(isStandardSyntaxUrl("\"some/$url\""), "url with dollar at the end and double quotes")

  t.ok(isStandardSyntaxUrl("\"@url/path\""), "url with ampersand at the start and double quotes")
  t.ok(isStandardSyntaxUrl("\"some/@url/path\""), "url with ampersand in the middle and double quotes")
  t.ok(isStandardSyntaxUrl("\"some/@url\""), "url with ampersand at the end and double quotes")
  t.ok(isStandardSyntaxUrl("@url/path"), "url with ampersand at the start")
  t.ok(isStandardSyntaxUrl("some/@url/path"), "url with ampersand in the middle")
  t.ok(isStandardSyntaxUrl("some/@url"), "url with ampersand at the end")
  t.ok(isStandardSyntaxUrl("@{less-variable}"), "url with less interpolation without quotes")
  t.ok(isStandardSyntaxUrl("@{less-variable}/path"), "url with less interpolation at the start without quotes")
  t.ok(isStandardSyntaxUrl("some/@{less-variable}/path"), "url with less interpolation in the middle without quotes")
  t.ok(isStandardSyntaxUrl("some/@{less-variable}"), "url with less interpolation at the end without quotes")

  t.notOk(isStandardSyntaxUrl("#{$sass-variable}-color/images/bg.png"), "sass interpolation at the start")
  t.notOk(isStandardSyntaxUrl("images/#{$sass-variable}-color/bg.png"), "sass interpolation in the middle")
  t.notOk(isStandardSyntaxUrl("images/#{$sass-variable}.png"), "sass interpolation at the end")
  t.notOk(isStandardSyntaxUrl("'#{$sass-variable}-color/images/bg.png'"), "sass interpolation at the start with single quotes")
  t.notOk(isStandardSyntaxUrl("'images/#{$sass-variable}-color/bg.png'"), "sass interpolation in the middle with single quotes")
  t.notOk(isStandardSyntaxUrl("'images/#{$sass-variable}'"), "sass interpolation at the end with single quotes")
  t.notOk(isStandardSyntaxUrl("\"#{$sass-variable}-color/images/bg.png\""), "sass interpolation at the start with double quotes")
  t.notOk(isStandardSyntaxUrl("\"images/#{$sass-variable}-color/bg.png\""), "sass interpolation in the middle with double quotes")
  t.notOk(isStandardSyntaxUrl("\"images/#{$sass-variable}\""), "sass interpolation at the end with double quotes")

  t.notOk(isStandardSyntaxUrl("$sass-variable"), "sass variable")
  t.notOk(isStandardSyntaxUrl("$sass-variable + 'foo'"), "sass variable concat with single quotes string")
  t.notOk(isStandardSyntaxUrl("$sass-variable + \'foo\'"), "sass variable concat with escaped single quotes string")
  t.notOk(isStandardSyntaxUrl("$sass-variable + 'foo'"), "sass variable concat with double quotes string")
  t.notOk(isStandardSyntaxUrl("$sass-variable+'foo'"), "sass variable concat with single quotes string without spaces")
  t.notOk(isStandardSyntaxUrl("$sass-variable + foo"), "sass variable and concatenation")
  t.notOk(isStandardSyntaxUrl("test + $sass-variable + foo"), "sass variable and concatenation")
  t.notOk(isStandardSyntaxUrl("#{$sass-variable + foo}"), "sass interpolation and concatenation")
  t.notOk(isStandardSyntaxUrl("\"#{$sass-variable + foo}\""), "sass interpolation and concatenation with double quotes")

  t.notOk(isStandardSyntaxUrl("@less-variable"), "less variable")
  t.notOk(isStandardSyntaxUrl("\"@{less-variable}\""), "less interpolation")
  t.notOk(isStandardSyntaxUrl("\"~@{less-variable}\""), "less interpolation with escaped")

  t.notOk(isStandardSyntaxUrl("'@{less-variable}-color/images/bg.png'"), "less interpolation at the start with single quotes")
  t.notOk(isStandardSyntaxUrl("'images/@{less-variable}-color/bg.png'"), "less interpolation in the middle with single quotes")
  t.notOk(isStandardSyntaxUrl("'images/@{less-variable}'"), "less interpolation at the end with single quotes")

  t.notOk(isStandardSyntaxUrl("\"@{less-variable}-color/images/bg.png\""), "less interpolation at the start with double quotes")
  t.notOk(isStandardSyntaxUrl("\"images/@{less-variable}-color/bg.png\""), "less interpolation in the middle with double quotes")
  t.notOk(isStandardSyntaxUrl("\"images/@{less-variable}\""), "less interpolation at the end with double quotes")

  t.end()
})
