/**
 * Check is known unit
 *
 * @param {string} Unit
 * @return {boolean} If `true`, the unit is known
 */

const knownUnits = new Set([
  // Relative length units
  "em", "ex", "ch", "rem", "%",
  // Viewport-percentage lengths
  "vh", "vw", "vmin", "vmax", "vm",
  // Absolute length units
  "px", "mm", "cm", "in", "pt", "pc", "q",
  // Time length units
  "s", "ms",
  // Angle
  "deg", "grad", "turn", "rad",
  // Frequency
  "Hz", "kHz",
  // Resolution
  "dpi", "dpcm", "dppx",
])

export default function (unit) {
  return knownUnits.has(unit)
}
