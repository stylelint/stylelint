/**
 * Check whether a media feature is a range context one
 *
 * @param {string} media feature
 * @return {boolean} If `true`, media feature is a range context one
 */
export default function (mediaFeature) {
  return (
    mediaFeature.indexOf("=") !== -1
    || mediaFeature.indexOf("<") !== -1
    || mediaFeature.indexOf(">") !== -1
  )
}
