/**
 * Check whether a media feature name is standard
 *
 * @param {string} media feature name
 * @return {boolean} If `true`, the media feature name is standard
 */
export default function (mediaFeatureName) {
  // SCSS interpolation
  if (/#{.+?}|\$.+?/.test(mediaFeatureName)) {
    return false
  }

  return true
}
