import hasBlock from "./hasBlock"
import statementStringBeforeBlock from "./statementStringBeforeBlock"

/**
 * Return the string that starts and `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`),
 * returns undefined.
 *
 * @param {PostCSSAtRule|PostCSSRule} statement
 * @return {string|undefined}
 */
export default function (statement) {
  if (!hasBlock(statement)) { return }
  return statement.toString().slice(statementStringBeforeBlock(statement).length)
}
