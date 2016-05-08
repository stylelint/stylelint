import {
  findFontFamily,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { fontFamilyKeywords } from "../../reference/keywordSets"

export const ruleName = "font-family-name-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (style, family) => `Expected ${style} quotes around font-family name "${family}"`,
})

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

        "always-where-required",
        "always-where-recommended",
        "always-unless-keyword",
      ],
    })
    if (!validOptions) { return }

    if (
      expectation === "single-where-required"
      || expectation === "single-where-recommended"
      || expectation === "single-unless-keyword"
      || expectation === "double-where-required"
      || expectation === "double-where-recommended"
      || expectation === "double-unless-keyword"
    ) {
      result.warn((
        "The '" + expectation + "' option for 'font-family-name-quotes' has been deprecated, "
          + "and will be removed in '7.0'. Instead, use the 'always-where-required', 'always-where-recommended' or 'always-unless-keyword' options together with the 'string-quotes' rule."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "http://stylelint.io/user-guide/rules/font-family-name-quotes/",
      })
    }

    root.walkDecls(/^font-family$/i, decl => {
      const fontFamilies = findFontFamily(decl.value)

      if (fontFamilies.length === 0) { return }

      fontFamilies.forEach(fontFamilyNode => {
        let rawFamily = fontFamilyNode.value

        if (fontFamilyNode.quote) {
          rawFamily = fontFamilyNode.quote + rawFamily + fontFamilyNode.quote
        }

        checkFamilyName(rawFamily, decl)
      })
    })

    function checkFamilyName(rawFamily, decl) {
      const quoteType = getQuoteType(rawFamily)
      // Clean the family of its quotes
      const family = rawFamily.replace(/^['"]|['"]$/g, "")

      // Disallow quotes around (case-insensitive) keywords in all cases
      if (fontFamilyKeywords.has(family.toLowerCase())) {
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

        case "always-where-recommended":
          if (!recommended && quoteType !== "none") {
            return complain(messages.expected("no", family), family, decl)
          }
          if (recommended && quoteType === "none") {
            return complain(messages.expected("", family), family, decl)
          }
          return

        case "always-where-required":
          if (!required && quoteType !== "none") {
            return complain(messages.expected("no", family), family, decl)
          }
          if (required && quoteType === "none") {
            return complain(messages.expected("", family), family, decl)
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
