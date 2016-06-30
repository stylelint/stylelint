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

export const basicKeywords = new Set([
  "initial",
  "inherit",
  "unset",
])

export const fontFamilyKeywords = uniteSets(basicKeywords, [
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
  basicKeywords,
  fontWeightRelativeKeywords,
  fontWeightAbsoluteKeywords
)

export const animationNameKeywords = uniteSets(basicKeywords, [
  "none",
])

export const animationTimingFunctionKeywords = uniteSets(basicKeywords, [
  "linear",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "step-start",
  "step-end",
  "steps",
  "cubic-bezier",
])

export const animationIterationCountKeywords = new Set([
  "infinite",
])

export const animationDirectionKeywords = uniteSets(basicKeywords, [
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse",
])

export const animationFillModeKeywords = new Set([
  "none",
  "forwards",
  "backwards",
  "both",
])

export const animationPlayStateKeywords = uniteSets(basicKeywords, [
  "running",
  "paused",
])

// cf. https://developer.mozilla.org/en-US/docs/Web/CSS/animation
export const animationShorthandKeywords = uniteSets(
  basicKeywords,
  animationNameKeywords,
  animationTimingFunctionKeywords,
  animationIterationCountKeywords,
  animationDirectionKeywords,
  animationFillModeKeywords,
  animationPlayStateKeywords
)

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
export const counterIncrementKeywords = uniteSets(basicKeywords, [
  "none",
])

export const gridRowKeywords = uniteSets(basicKeywords, [
  "auto",
  "span",
])

export const gridColumnKeywords = uniteSets(basicKeywords, [
  "auto",
  "span",
])

export const gridAreaKeywords = uniteSets(basicKeywords, [
  "auto",
  "span",
])

// https://developer.mozilla.org/ru/docs/Web/CSS/list-style-type
export const listStyleTypeKeywords = uniteSets(basicKeywords, [
  "none",
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

export const listStylePositionKeywords = uniteSets(basicKeywords, [
  "inside",
  "outside",
])

export const listStyleImageKeywords = uniteSets(basicKeywords, [
  "none",
])

export const listStyleShorthandKeywords = uniteSets(
  basicKeywords,
  listStyleTypeKeywords,
  listStylePositionKeywords,
  listStyleImageKeywords
)

export const fontStyleKeywords = uniteSets(basicKeywords, [
  "normal",
  "italic",
  "oblique",
])

export const fontVariantKeywords = uniteSets(basicKeywords, [
  "normal",
  "none",
  "historical-forms",
  "none",
  "common-ligatures",
  "no-common-ligatures",
  "discretionary-ligatures",
  "no-discretionary-ligatures",
  "historical-ligatures",
  "no-historical-ligatures",
  "contextual",
  "no-contextual",
  "small-caps",
  "small-caps",
  "all-small-caps",
  "petite-caps",
  "all-petite-caps",
  "unicase",
  "titling-caps",
  "lining-nums",
  "oldstyle-nums",
  "proportional-nums",
  "tabular-nums",
  "diagonal-fractions",
  "stacked-fractions",
  "ordinal",
  "slashed-zero",
  "jis78",
  "jis83",
  "jis90",
  "jis04",
  "simplified",
  "traditional",
  "full-width",
  "proportional-width",
  "ruby",
])

export const fontStretchKeywords = uniteSets(basicKeywords, [
  "semi-condensed",
  "condensed",
  "extra-condensed",
  "ultra-condensed",
  "semi-expanded",
  "expanded",
  "extra-expanded",
  "ultra-expanded",
])

export const fontSizeKeywords = uniteSets(basicKeywords, [
  "xx-small",
  "x-small",
  "small",
  "medium",
  "large",
  "x-large",
  "xx-large",
  "larger",
  "smaller",
])

export const lineHeightKeywords = uniteSets(basicKeywords, [
  "normal",
])

export const fontShorthandKeywords = uniteSets(
  basicKeywords,
  fontStyleKeywords,
  fontVariantKeywords,
  fontWeightKeywords,
  fontStretchKeywords,
  fontSizeKeywords,
  lineHeightKeywords,
  fontFamilyKeywords
)

export const keyframeSelectorKeywords = new Set([
  "from",
  "to",
])

// https://developer.mozilla.org/en/docs/Web/CSS/At-rule
export const atRules = new Set([
  "apply",
  "annotation",
  "character-variant",
  "charset",
  "counter-style",
  "custom-media",
  "custom-selector",
  "document",
  "font-face",
  "font-feature-values",
  "import",
  "keyframes",
  "media",
  "namespace",
  "nest",
  "ornaments",
  "page",
  "styleset",
  "stylistic",
  "supports",
  "swash",
  "viewport",
])

function uniteSets(...sets) {
  return new Set(sets.reduce((result, set) => {
    return result.concat(_.toArray(set))
  }, []))
}
