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

export const units = new Set([
  ...nonLengthUnits,
  ...lengthUnits,
])

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

export const fontWeightKeywords = new Set([
  ...fontWeightRelativeKeywords,
  ...fontWeightAbsoluteKeywords,
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

export const pseudoElements = new Set([
  ...levelOneAndTwoPseudoElements,
  ...levelThreePseudoElements,
])

export const pseudoClasses = new Set([
  "active",
  "any-link",
  "blank",
  "checked",
  "contains",
  "current",
  "default",
  "dir",
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
  "lang",
  "last-child",
  "last-of-type",
  "link",
  "matches",
  "not",
  "nth-child",
  "nth-column",
  "nth-last-child",
  "nth-last-column",
  "nth-last-of-type",
  "nth-of-type",
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

export const timeProperties = new Set([
  ...shorthandTimeProperties,
  ...longhandTimeProperties,
])

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
