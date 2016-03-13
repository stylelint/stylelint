import postcss from "postcss"
import {
  cssWordIsVariable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "font-family-name-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (style, family) => `Expected ${style} quotes around font-family name "${family}"`,
})

const FONT_FAMILY_KEYWORDS = [ "inherit", "serif", "sans-serif", "cursive", "fantasy", "monospace" ]

// "To avoid mistakes in escaping, it is recommended to quote font family names
// that contain white space, digits, or punctuation characters other than hyphens"
// (https://www.w3.org/TR/CSS2/fonts.html#font-family-prop)
function quotesRecommended(family) {
  return !/^[-a-zA-Z]+$/.test(family)
}

// Quotes are required if the family is not a valid CSS identifier
// (regexes from https://mathiasbynens.be/notes/unquoted-font-family)
function quotesRequired(family) {
  return family.split(/\s+/).some(word => {
    return (
      /^(-?\d|--)/.test(word)
      || !/^[-_a-zA-Z0-9\u00A0-\u10FFFF]+$/.test(word)
    )
  })
}

function getQuoteType(str) {
  if (str[0] && str[str.length - 1] === "\"") { return "double" }
  if (str[0] && str[str.length - 1] === "'") { return "single" }
  return "none"
}

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "single-where-required",
        "single-where-recommended",
        "single-unless-keyword",
        "double-where-required",
        "double-where-recommended",
        "double-unless-keyword",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls("font-family", decl => {
      postcss.list.comma(decl.value).forEach(familyName => {
        checkFamilyName(familyName, decl)
      })
    })

    function checkFamilyName(rawFamily, decl) {
      if (cssWordIsVariable(rawFamily)) { return }

      const quoteType = getQuoteType(rawFamily)
      // Clean the family of its quotes
      const family = rawFamily.replace(/^['"]|['"]$/g, "")

      // Disallow quotes around (case-insensitive) keywords in all cases
      if (FONT_FAMILY_KEYWORDS.indexOf(family.toLowerCase()) !== -1) {
        if (quoteType !== "none") {
          return complain(messages.expected("no", family), family, decl)
        }
        return
      }

      const required = quotesRequired(family)
      const recommended = quotesRecommended(family)

      switch (expectation) {
        case "single-where-required":
          if (!required && quoteType !== "none") {
            return complain(messages.expected("no", family), family, decl)
          }
          if (required && quoteType !== "single") {
            return complain(messages.expected("single", family), family, decl)
          }
          return
        case "single-where-recommended":
          if (!recommended && quoteType !== "none") {
            return complain(messages.expected("no", family), family, decl)
          }
          if (recommended && quoteType !== "single") {
            return complain(messages.expected("single", family), family, decl)
          }
          return
        case "single-unless-keyword":
          if (quoteType !== "single") {
            return complain(messages.expected("single", family), family, decl)
          }
          return
        case "double-where-required":
          if (!required && quoteType !== "none") {
            return complain(messages.expected("no", family), family, decl)
          }
          if (required && quoteType !== "double") {
            return complain(messages.expected("double", family), family, decl)
          }
          return
        case "double-where-recommended":
          if (!recommended && quoteType !== "none") {
            return complain(messages.expected("no", family), family, decl)
          }
          if (recommended && quoteType !== "double") {
            return complain(messages.expected("double", family), family, decl)
          }
          return
        case "double-unless-keyword":
          if (quoteType !== "double") {
            return complain(messages.expected("double", family), family, decl)
          }
          return
        default: return
      }
    }

    function complain(message, family, decl) {
      report({
        result,
        ruleName,
        message,
        node: decl,
        word: family,
      })
    }
  }
}
