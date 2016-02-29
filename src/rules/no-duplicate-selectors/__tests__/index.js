import postcss from "postcss"
import postcssImport from "postcss-import"
import path from "path"
import test from "tape"
import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  warningFreeBasics(tr)

  tr.ok("a {} b {} c {} d, e, f {}", "no duplicates")
  tr.ok("a {}\n@media print { a {} }", "duplicate inside media query")
  tr.ok("a { a { a {} } }", "duplicates inside nested rules")
  tr.ok(".foo .bar {}\n .foo {}\n.bar {}\n.bar .foo {}", "selectors using parts of other selectors")
  tr.ok("a {} a, b {}", "selectors reused in other non-equivalent selector lists")
  tr.ok("a b { top: 0; } a { b, c { color: pink; } }", "nested resolution")

  tr.notOk("a, a {}", {
    message: messages.rejected("a"),
    line: 1,
    column: 1,
  }, "duplicate within one rule's selector list")
  tr.notOk("a {} b {} a {}", {
    message: messages.rejected("a"),
    line: 1,
    column: 11,
  }, "duplicate simple selectors with another rule between")
  tr.notOk("a, b {} b, a {}", {
    message: messages.rejected("b, a"),
    line: 1,
    column: 9,
  }, "essentially duplicate selector lists")
  tr.notOk(".foo   a, b\t> .bar,\n#baz {}\n  #baz,\n\n  .foo     a,b>.bar {}", {
    message: messages.rejected("#baz,\n\n  .foo     a,b>.bar"),
    line: 3,
    column: 3,
  }, "essentially duplicate selector lists with varied spacing")
  tr.notOk("a {}\n@media print { a, a {} }", {
    message: messages.rejected("a"),
    line: 2,
    column: 16,
  }, "duplicate within a media query, in the same rule")
  tr.notOk("a {}\n@media print { a {} a {} }", {
    message: messages.rejected("a"),
    line: 2,
    column: 21,
  }, "duplicate within a media query, in different rules")
  tr.notOk("a b {} a { b {} }", {
    message: messages.rejected("a b"),
    line: 1,
    column: 12,
  }, "duplicate caused by nesting")
})

test("with postcss-import and duplicates within a file", t => {
  t.plan(1)
  postcss([ postcssImport(), rule() ])
    .process("@import 'fixtures/using-foo-twice.css';", {
      from: path.join(__dirname, "test.css"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "a warning strikes")
    })
})

test("with postcss-import and duplicates across files", t => {
  t.plan(1)
  postcss([ postcssImport(), rule() ])
    .process("@import 'fixtures/using-foo.css'; @import 'fixtures/also-using-foo.css';", {
      from: path.join(__dirname, "test.css"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "no warnings")
    })
})
