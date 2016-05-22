import _ from "lodash"

export const nonLengthUnits = new Set([
  // Relative length units
  "%",
  // Time length units
  "s",
  "ms",
  // Angle
  "deg",
  "grad",
  "turn",
  "rad",
  // Frequency
  "Hz",
  "kHz",
  // Resolution
  "dpi",
  "dpcm",
  "dppx",
])

export const lengthUnits = new Set([
  // Relative length units
  "em",
  "ex",
  "ch",
  "rem",
  // Viewport-percentage lengths
  "vh",
  "vw",
  "vmin",
  "vmax",
  "vm",
  // Absolute length units
  "px",
  "mm",
  "cm",
  "in",
  "pt",
  "pc",
  "q",
])

export const units = uniteSets(
  nonLengthUnits,
  lengthUnits
)

export const colorFunctionNames = new Set([
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "gray",
])

export const fontFamilyKeywords = new Set([
  "inherit",
  "unset",
  "serif",
  "sans-serif",
  "cursive",
  "fantasy",
  "monospace",
])

export const fontWeightRelativeKeywords = new Set([
  "bolder",
  "lighter",
])

export const fontWeightAbsoluteKeywords = new Set([
  "bold",
])

export const fontWeightKeywords = uniteSets(
  fontWeightRelativeKeywords,
  fontWeightAbsoluteKeywords
)

export const camelCaseFunctionNames = new Set([
  "translateX",
  "translateY",
  "translateZ",
  "scaleX",
  "scaleY",
  "scaleZ",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
])

// cf. https://developer.mozilla.org/en-US/docs/Web/CSS/animation
export const animationShorthandKeywords = new Set([
  "infinite",
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse",
  "none",
  "initial",
  "inherit",
  "unset",
  "forwards",
  "backwards",
  "both",
  "running",
  "paused",
  "linear",
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "step-start",
  "step-end",
])

export const animationNameKeywords = new Set([
  "none",
  "initial",
  "inherit",
  "unset",
])

// These are the ones that can have single-colon notation
export const levelOneAndTwoPseudoElements = new Set([
  "before",
  "after",
  "first-line",
  "first-letter",
])

// These are the ones that require double-colon notation
export const levelThreePseudoElements = new Set([
  "before",
  "after",
  "first-line",
  "first-letter",
  "selection",
  "spelling-error",
  "grammar-error",
  "backdrop",
  "marker",
  "placeholder",
  "shadow",
  "content",
])

export const pseudoElements = uniteSets(
  levelOneAndTwoPseudoElements,
  levelThreePseudoElements
)

export const aNPlusBNotationPseudoClasses = new Set([
  "nth-child",
  "nth-column",
  "nth-last-child",
  "nth-last-column",
  "nth-last-of-type",
  "nth-of-type",
])

export const linguisticPseudoClasses = new Set([
  "dir",
  "lang",
])

export const otherPseudoClasses = new Set([
  "active",
  "any-link",
  "blank",
  "checked",
  "contains",
  "current",
  "default",
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first-child",
  "first-of-type",
  "focus",
  "focus-within",
  "fullscreen",
  "future",
  "has",
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "last-child",
  "last-of-type",
  "link",
  "matches",
  "not",
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "root",
  "scope",
  "target",
  "user-error",
  "user-invalid",
  "val",
  "valid",
  "visited",
])

export const pseudoClasses = uniteSets(
  aNPlusBNotationPseudoClasses,
  linguisticPseudoClasses,
  otherPseudoClasses
)

export const shorthandTimeProperties = new Set([
  "transition",
  "animation",
])

export const longhandTimeProperties = new Set([
  "transition-duration",
  "transition-delay",
  "animation-duration",
  "animation-delay",
])

export const timeProperties = uniteSets(
  shorthandTimeProperties,
  longhandTimeProperties
)

export const camelCaseKeywords = new Set([
  "optimizeSpeed",
  "optimizeLegibility",
  "geometricPrecision",
  "currentColor",
])

// https://developer.mozilla.org/docs/Web/CSS/counter-increment
export const counterIncrementKeywords = new Set([
  "none",
  "inherit",
  "initial",
  "unset",
])

export const gridRowKeywords = new Set([
  "auto",
  "span",
])

export const gridColumnKeywords = new Set([
  "auto",
  "span",
])

export const gridAreaKeywords = new Set([
  "unset",
  "initial",
  "inherit",
  "auto",
  "span",
])

// https://developer.mozilla.org/ru/docs/Web/CSS/list-style-type
export const listStyleTypeKeywords = new Set([
  "none",
  "unset",
  "initial",
  "inherit",
  "disc",
  "circle",
  "square",
  "decimal",
  "cjk-decimal",
  "decimal-leading-zero",
  "lower-roman",
  "upper-roman",
  "lower-greek",
  "lower-alpha",
  "lower-latin",
  "upper-alpha",
  "upper-latin",
  "arabic-indic",
  "armenian",
  "bengali",
  "cambodian",
  "cjk-earthly-branch",
  "cjk-ideographic",
  "devanagari",
  "ethiopic-numeric",
  "georgian",
  "gujarati",
  "gurmukhi",
  "hebrew",
  "hiragana",
  "hiragana-iroha",
  "japanese-formal",
  "japanese-informal",
  "kannada",
  "katakana",
  "katakana-iroha",
  "khmer",
  "korean-hangul-formal",
  "korean-hanja-formal",
  "korean-hanja-informal",
  "lao",
  "lower-armenian",
  "malayalam",
  "mongolian",
  "myanmar",
  "oriya",
  "persian",
  "simp-chinese-formal",
  "simp-chinese-informal",
  "tamil",
  "telugu",
  "thai",
  "tibetan",
  "trad-chinese-formal",
  "trad-chinese-informal",
  "upper-armenian",
  "disclosure-open",
  "disclosure-closed",
  // Non-standard extensions (without prefixe)
  "ethiopic-halehame",
  "ethiopic-halehame-am",
  "ethiopic-halehame-ti-er",
  "ethiopic-halehame-ti-et",
  "hangul",
  "hangul-consonant",
  "urdu",
])

function uniteSets(...sets) {
  return new Set(sets.reduce((result, set) => {
    return result.concat(_.toArray(set))
  }, []))
}
