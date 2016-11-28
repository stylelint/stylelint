"use strict"

/**
 * Check whether a media feature name is standard
 *
 * @param {string} media feature name
 * @return {boolean} If `true`, the media feature name is standard
 */
module.exports = function (mediaFeatureName) {
  // SCSS interpolation
  if (/#{.+?}|\$.+?/.test(mediaFeatureName)) {
    return false
  }

  return true
}
