import htmlparser from "htmlparser2"

/**
 * Extract styles from html markup, returning the exctacted
 * code with line and indentation mappings.
 *
 * @param {string} code
 * @return {object} { map, code }
 */
export default function styleTagsFromHtmlExtracter(code) {
  const map = []
  let resultCode = ""
  let lineNumber = 1
  let relativeLineNumber = 1
  const isStructureHTML = iterateCodeForStyleTags(code, function (previousCode, styleCode) {
    const indentMatch = /[\n\r]+([ \t]*)/.exec(styleCode)
    const indent = indentMatch ? indentMatch[1] : ""
    const previousCodeLines = previousCode.match(/\n|\r/g)

    // Preserve line numbers and indentation mapping
    if (previousCodeLines) {
      lineNumber += previousCodeLines.length
    }

    resultCode += styleCode
      .replace(/(\n|\r)([ \t]*)(.*)/g, function (_, newLineChar, lineIndent, lineText) {
        map[relativeLineNumber++] = {
          indent: indent.length,
          line: lineNumber++,
        }
        return newLineChar + lineIndent.slice(indent.length) + lineText
      })
      .replace(/[ \t]*$/, "")  // Remove spaces on the last line
  })

  return {
    map,
    code: isStructureHTML ? resultCode : code,
  }
}

/**
 * Iterate through style tags. Extracting content of code
 * with onStyle callback
 *
 * @param {string} code
 * @param {function} onStyle
 */
export function iterateCodeForStyleTags(code, onStyle) {
  let index = 0
  let currentStyle = null
  let isStructureHTML = false

  const parser = new htmlparser.Parser({
    onopentag(name) {
      // Found a tag, the structure is now confirmed as HTML
      isStructureHTML = true
      // Test if current tag is a valid <style> tag.
      if (name !== "style") {
        return
      }
      currentStyle = ""
    },

    onclosetag(name) {
      if (name !== "style" || currentStyle === null) {
        return
      }
      onStyle(code.slice(index, parser.startIndex - currentStyle.length), currentStyle)
      index = parser.startIndex
      currentStyle = null
    },

    ontext(data) {
      if (currentStyle === null) {
        return
      }
      currentStyle += data
    },
  })

  parser.parseComplete(code)
  return isStructureHTML
}
