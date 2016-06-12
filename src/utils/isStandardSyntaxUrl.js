/**
 * Check whether a URL is standard
 *
 * @param {string} url
 * @return {boolean} If `true`, the url is standard
 */
export default function (url) {

  // SCSS or Less interpolation
  if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(url)) { return false }

  // Inside `'` and `"` work only interpolation
  if (url[0] === "'" && url[url.length - 1] === "'"
    || url[0] === "\"" && url[url.length - 1] === "\""
  ) { return true }

  // Sass and Less variables at the beginning or after a + sign within
  if (url[0] === "$" || url[0] === "@" || /['"]\s*\+\s*[\$@]/.test(url)) { return false }

  return true
}
