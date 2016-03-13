/**
 * Test for a few basic patterns that usually should
 * case no warnings.
 *
 * This should not be used by rules that intentionally
 * warn for these cases.
 */
export default function (tr) {
  tr.ok("", "empty stylesheet")
  tr.ok("a {}", "empty rule set")
  tr.ok (":global {}", "CSS Modules global empty rule set")
  tr.ok("@import \"foo.css\";", "blockless statement")
}
