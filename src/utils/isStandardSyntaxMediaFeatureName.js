/**
 * Check whether a media feature name is standard
 *
 * @param {string} media feature name
 * @return {boolean} If `true`, the media feature name is standard
 */
export default function (mediaFeatureName) {

  // Custom media queries
  if (mediaFeatureName[0] === "-" && mediaFeatureName[1] === "-") { return false }

  // SCSS interpolation
  if (/#{.+?}|\$.+?/.test(mediaFeatureName)) { return false }

  return true
}
