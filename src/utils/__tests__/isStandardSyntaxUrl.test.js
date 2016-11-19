import isStandardSyntaxUrl from "../isStandardSyntaxUrl"

it("isStandardSyntaxUrl", () => {
  expect(isStandardSyntaxUrl("")).toBeTruthy()
  expect(isStandardSyntaxUrl("some/path/to/file.png")).toBeTruthy()
  expect(isStandardSyntaxUrl("'some/path/to/file.png'")).toBeTruthy()
  expect(isStandardSyntaxUrl("\"some/path/to/file.png\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("\"some/path/to/file.png\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("/some/path/to/file.png")).toBeTruthy()
  expect(isStandardSyntaxUrl("//www.domain.com/file.jpg")).toBeTruthy()
  expect(isStandardSyntaxUrl("./some/path/to/file.png")).toBeTruthy()
  expect(isStandardSyntaxUrl("../some/path/to/file.png")).toBeTruthy()
  expect(isStandardSyntaxUrl("https://www.domain.com:8080/file.jpg")).toBeTruthy()
  expect(isStandardSyntaxUrl(
    "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
  )).toBeTruthy()

  expect(isStandardSyntaxUrl("http://domain.com:8080/path/to$to/file$2x.ext?$1=$2")).toBeTruthy()
  expect(
    isStandardSyntaxUrl("'http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2'")
  ).toBeTruthy()
  expect(
    isStandardSyntaxUrl("\"http://domain.com:8080/path$path/to$to/$file$2x.ext?$1$2=$1$2\"")
  ).toBeTruthy()

  expect(isStandardSyntaxUrl("http://domain.com:8080/path/to@to/file@2x.ext?@1=@2")).toBeTruthy()
  expect(
    isStandardSyntaxUrl("'http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2'")
  ).toBeTruthy()
  expect(
    isStandardSyntaxUrl("\"http://domain.com:8080/path$path/to@to/$file@2x.ext?@1$2=$1@2\"")
  ).toBeTruthy()

  expect(isStandardSyntaxUrl("\"$url/path\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("\"some/$url/path\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("\"some/$url\"")).toBeTruthy()

  expect(isStandardSyntaxUrl("\"@url/path\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("\"some/@url/path\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("\"some/@url\"")).toBeTruthy()
  expect(isStandardSyntaxUrl("@url/path")).toBeTruthy()
  expect(isStandardSyntaxUrl("some/@url/path")).toBeTruthy()
  expect(isStandardSyntaxUrl("some/@url")).toBeTruthy()
  expect(isStandardSyntaxUrl("@{less-variable}")).toBeTruthy()
  expect(isStandardSyntaxUrl("@{less-variable}/path")).toBeTruthy()
  expect(isStandardSyntaxUrl("some/@{less-variable}/path")).toBeTruthy()
  expect(isStandardSyntaxUrl("some/@{less-variable}")).toBeTruthy()

  expect(isStandardSyntaxUrl("#{$sass-variable}-color/images/bg.png")).toBeFalsy()
  expect(isStandardSyntaxUrl("images/#{$sass-variable}-color/bg.png")).toBeFalsy()
  expect(isStandardSyntaxUrl("images/#{$sass-variable}.png")).toBeFalsy()
  expect(isStandardSyntaxUrl("'#{$sass-variable}-color/images/bg.png'")).toBeFalsy()
  expect(isStandardSyntaxUrl("'images/#{$sass-variable}-color/bg.png'")).toBeFalsy()
  expect(isStandardSyntaxUrl("'images/#{$sass-variable}'")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"#{$sass-variable}-color/images/bg.png\"")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"images/#{$sass-variable}-color/bg.png\"")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"images/#{$sass-variable}\"")).toBeFalsy()

  expect(isStandardSyntaxUrl("$sass-variable")).toBeFalsy()
  expect(isStandardSyntaxUrl("$sass-variable + 'foo'")).toBeFalsy()
  expect(isStandardSyntaxUrl("$sass-variable + \'foo\'")).toBeFalsy()
  expect(isStandardSyntaxUrl("$sass-variable + 'foo'")).toBeFalsy()
  expect(isStandardSyntaxUrl("$sass-variable+'foo'")).toBeFalsy()
  expect(isStandardSyntaxUrl("$sass-variable + foo")).toBeFalsy()
  expect(isStandardSyntaxUrl("test + $sass-variable + foo")).toBeFalsy()
  expect(isStandardSyntaxUrl("#{$sass-variable + foo}")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"#{$sass-variable + foo}\"")).toBeFalsy()

  expect(isStandardSyntaxUrl("@less-variable")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"@{less-variable}\"")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"~@{less-variable}\"")).toBeFalsy()

  expect(isStandardSyntaxUrl("'@{less-variable}-color/images/bg.png'")).toBeFalsy()
  expect(isStandardSyntaxUrl("'images/@{less-variable}-color/bg.png'")).toBeFalsy()
  expect(isStandardSyntaxUrl("'images/@{less-variable}'")).toBeFalsy()

  expect(isStandardSyntaxUrl("\"@{less-variable}-color/images/bg.png\"")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"images/@{less-variable}-color/bg.png\"")).toBeFalsy()
  expect(isStandardSyntaxUrl("\"images/@{less-variable}\"")).toBeFalsy()
})
