import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"(a) ( a )\"; }")
  tr.ok("a::before { background: url( 'asdf(Vcxvsd)ASD' ); }")
  tr.ok("a { transform: translate( 1, 1 ); }")
  tr.ok("a { color: color( rgb( 0, 0, 0 ) lightness( 50% ) ); }")

  tr.notOk("a { transform: translate(1, 1 ); }", messages.expectedOpening)
  tr.notOk("a { transform: translate( 1, 1); }", messages.expectedClosing)
  tr.notOk("a { transform: translate(  1, 1 ); }", messages.expectedOpening)
  tr.notOk("a { transform: translate( 1, 1  ); }", messages.expectedClosing)
  tr.notOk("a { color: color(rgb( 0, 0, 0 ) lightness( 50% ) ); }", messages.expectedOpening)
  tr.notOk("a { color: color( rgb(0, 0, 0 ) lightness( 50% ) ); }", messages.expectedOpening)
  tr.notOk("a { color: color( rgb( 0, 0, 0) lightness( 50% ) ); }", messages.expectedClosing)
  tr.notOk("a { color: color( rgb( 0, 0, 0 ) lightness(50% ) ); }", messages.expectedOpening)
  tr.notOk("a { color: color( rgb( 0, 0, 0 ) lightness( 50%) ); }", messages.expectedClosing)
  tr.notOk("a { color: color( rgb( 0, 0, 0 ) lightness( 50% )); }", messages.expectedClosing)
  tr.notOk("a::before { content: attr(data-foo ); }", messages.expectedOpening)
  tr.notOk("a::before { content: attr( data-foo); }", messages.expectedClosing)
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"(a) ( a )\"; }")
  tr.ok("a::before { background: url('asdf( Vcxvsd )ASD'); }")
  tr.ok("a::before { content: \"(a) ( a )\"; }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { color: color(rgb(0, 0, 0) lightness(50%)); }")

  tr.notOk("a { transform: translate( 1, 1); }", messages.rejectedOpening)
  tr.notOk("a { transform: translate(  1, 1); }", messages.rejectedOpening)
  tr.notOk("a { transform: translate(1, 1 ); }", messages.rejectedClosing)
  tr.notOk("a { transform: translate(1, 1  ); }", messages.rejectedClosing)
  tr.notOk("a { color: color( rgb(0, 0, 0) lightness(50%)); }", messages.rejectedOpening)
  tr.notOk("a { color: color(rgb( 0, 0, 0) lightness(50%)); }", messages.rejectedOpening)
  tr.notOk("a { color: color(rgb(0, 0, 0 ) lightness(50%)); }", messages.rejectedClosing)
  tr.notOk("a { color: color(rgb(0, 0, 0) lightness( 50%)); }", messages.rejectedOpening)
  tr.notOk("a { color: color(rgb(0, 0, 0) lightness(50% )); }", messages.rejectedClosing)
  tr.notOk("a { color: color(rgb(0, 0, 0) lightness(50%) ); }", messages.rejectedClosing)
  tr.notOk("a::before { content: attr(data-foo ); }", messages.rejectedClosing)
  tr.notOk("a::before { content: attr( data-foo); }", messages.rejectedOpening)
})
