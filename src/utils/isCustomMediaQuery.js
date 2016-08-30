/**
 * Check whether a media query is a custom
 *
 * @param {string} mediaQuery
 * @return {boolean} If `true`, media query is a custom
 */
export default function (mediaQuery) {
  return (mediaQuery.slice(0, 2) === "--")
}
