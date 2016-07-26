import { hasInterpolation } from "../utils"
/**
 * Check whether a media feature is standard
 *
 * @param {string} mediaFeature
 * @return {boolean} If `true`, the media feature is standard
 */
export default function (mediaFeature) {

  // Remove outside parens
  mediaFeature = mediaFeature.slice(1, -1)

  // Parentheticals used for non-standard operations e.g. ($var - 10)
  if (mediaFeature.indexOf("(") !== -1) { return false }

  // SCSS or Less interpolation
  if (hasInterpolation(mediaFeature)) { return false }

  return true
}
