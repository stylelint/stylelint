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

  // SCSS var
  if (/\$[a-zA-Z_-][a-zA-Z0-9_-]*/.test(url)) { return false }

  // Less function allow only first and one variable, addition is forbidden
  if (url[0] === "@") { return false }

  return true
}
