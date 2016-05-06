import {
  default as styleTagsFromHtmlExtracter,
  iterateCodeForStyleTags,
} from "../styleTagsFromHtmlExtracter"
import test from "tape"

test("iterateCodeForStyleTags returns true if HTML structure", t => {
  const code = "<div></div>"
  const result = iterateCodeForStyleTags(code)
  t.equal(typeof result, "boolean")
  t.equal(result, true)
  t.end()
})

test("iterateCodeForStyleTags returns false if not HTML structure", t => {
  const code = "a { }"
  const result = iterateCodeForStyleTags(code)
  t.equal(typeof result, "boolean")
  t.equal(result, false)
  t.end()
})

test("iterateCodeForStyleTags found style tags call function with previous code and style code", t => {
  let found = 0
  const code = "<style>\na {}\n</style>\n<style></style>"
  const expectedPreviousCodes = [ "<style>", "</style>\n<style>" ]
  const expectedStyleCodes = [ "\na {}\n", "" ]
  iterateCodeForStyleTags(code, (previousCode, styleCode) => {
    t.equal(typeof previousCode, "string")
    t.equal(previousCode, expectedPreviousCodes[found])
    t.equal(typeof styleCode, "string")
    t.equal(styleCode, expectedStyleCodes[found])
    found++
  })
  t.end()
})

test("iterateCodeForStyleTags found style tags call function with previous code and style code", t => {
  let found = 0
  const code = "<sTyLe>\na {}\n</sTyLe>\n<sTyLe></sTyLe>"
  const expectedPreviousCodes = [ "<sTyLe>", "</sTyLe>\n<sTyLe>" ]
  const expectedStyleCodes = [ "\na {}\n", "" ]
  iterateCodeForStyleTags(code, (previousCode, styleCode) => {
    t.equal(typeof previousCode, "string")
    t.equal(previousCode, expectedPreviousCodes[found])
    t.equal(typeof styleCode, "string")
    t.equal(styleCode, expectedStyleCodes[found])
    found++
  })
  t.end()
})

test("iterateCodeForStyleTags found style tags call function with previous code and style code", t => {
  let found = 0
  const code = "<STYLE>\na {}\n</STYLE>\n<STYLE></STYLE>"
  const expectedPreviousCodes = [ "<STYLE>", "</STYLE>\n<STYLE>" ]
  const expectedStyleCodes = [ "\na {}\n", "" ]
  iterateCodeForStyleTags(code, (previousCode, styleCode) => {
    t.equal(typeof previousCode, "string")
    t.equal(previousCode, expectedPreviousCodes[found])
    t.equal(typeof styleCode, "string")
    t.equal(styleCode, expectedStyleCodes[found])
    found++
  })
  t.end()
})

test("styleTagsFromHtmlExtracter returns extrated code and mapping of line and indentation", t => {
  const code = "<script></script>\n<style>\n  a { }\n</style>\n<style>\na {\n}\n</style>"
  const expected = "\na { }\n\na {\n}\n"
  const result = styleTagsFromHtmlExtracter(code)
  // Expect result.code to be extracted code and a string
  t.equal(typeof result.code, "string")
  t.equal(result.code, expected)

  // Expect result.map to be an Array with 6 mapped lines
  t.equal(result.map instanceof Array, true)
  t.equal(result.map.length, 6)

  // First map entry is always undefined as no 0 line
  t.equal(result.map[0], undefined)

  // First style tag has base indentation of 2
  // with correct line mapping starting at 2
  t.equal(result.map[1].line, 2)
  t.equal(result.map[1].indent, 2)
  t.equal(result.map[2].line, 3)
  t.equal(result.map[2].indent, 2)

  // Second style tag has base indentation of 0
  // with correct line mapping starting at 5
  t.equal(result.map[3].line, 5)
  t.equal(result.map[3].indent, 0)
  t.equal(result.map[4].line, 6)
  t.equal(result.map[4].indent, 0)
  t.equal(result.map[5].line, 7)
  t.equal(result.map[5].indent, 0)

  t.end()
})

test("styleTagsFromHtmlExtracter returns empty string if no styles tags.", t => {
  const code = "<script></script>"
  const expected = ""
  const result = styleTagsFromHtmlExtracter(code)
  // Expect result.code to be extracted code and a string
  t.equal(typeof result.code, "string")
  t.equal(result.code, expected)

  // Expect result.map to be an Array with 0 mapped lines
  t.equal(result.map instanceof Array, true)
  t.equal(result.map.length, 0)

  t.end()
})

test("styleTagsFromHtmlExtracter returns original code if not HTML structure", t => {
  const code = "a {}"
  const expected = "a {}"
  const result = styleTagsFromHtmlExtracter(code)
  // Expect result.code to be extracted code and a string
  t.equal(typeof result.code, "string")
  t.equal(result.code, expected)

  // Expect result.map to be an Array with 0 mapped lines
  t.equal(result.map instanceof Array, true)
  t.equal(result.map.length, 0)

  t.end()
})
