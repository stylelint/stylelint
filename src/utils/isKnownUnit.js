/**
 * Check is known unit
 *
 * @param {string} Unit
 * @param {object} args - Named arguments object
 * @param {string} [args.only=false] - Check unit only with length
 * @return {boolean} If `true`, the unit is known
 */

const knownNonLengthUnits = new Set([
  // Relative length units
  "%",
  // Time length units
  "s", "ms",
  // Angle
  "deg", "grad", "turn", "rad",
  // Frequency
  "Hz", "kHz",
  // Resolution
  "dpi", "dpcm", "dppx",
])

const knownLengthUnits = new Set([
  // Relative length units
  "em", "ex", "ch", "rem",
  // Viewport-percentage lengths
  "vh", "vw", "vmin", "vmax", "vm",
  // Absolute length units
  "px", "mm", "cm", "in", "pt", "pc", "q",
])

export default function (unit, { only = false } = {}) {
  const unitLowerCase = unit.toLowerCase()

  if (only && only === "length") { return knownLengthUnits.has(unitLowerCase) }

  const knownUnits = new Set([ ...knownNonLengthUnits, ...knownLengthUnits ])

  return knownUnits.has(unit) || knownUnits.has(unitLowerCase)
}
