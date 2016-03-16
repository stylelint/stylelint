import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("lower", tr => {
    
  tr.ok("a {}")

  tr.ok("a::before {}")

  tr.ok("&a {}")

  tr.ok(".foo {}")
  tr.ok("#bar {}")

  tr.ok(".FOO {}")
  tr.ok("#BAR {}")
  
  tr.ok("a.FOO {}")
  tr.ok("a b {}")
  tr.ok("a { & b {}}")
  tr.ok("a, b, * {}")
  
  tr.ok("a:nth-child(3n + 1) {}")
  tr.ok("a:nth-child(n) {}")
  tr.ok("a:nth-child(odd) {}")
  tr.ok("a:nth-child(even) {}")
  tr.ok("a:nth-child(-n) {}")
  tr.ok("a { &:nth-child(3n + 1) {} }")
  tr.ok("@keyframes spin { 0% {} }")
  tr.ok("@keyframes spin { to {} from {} }")
  tr.ok(":root { --custom-property-set: {} }")

  tr.notOk("A {}", {
    message: messages.expected("A", "a"),
  })
  tr.notOk("DIV::before {}", {
    message: messages.expected("DIV", "div"),
  })
  tr.notOk("a B {}", {
    message: messages.expected("B", "b"),
  })
  tr.notOk("a { & B {}}", {
    message: messages.expected("B", "b"),
  })
  tr.notOk("A:nth-child(even) {}", {
    message: messages.expected("A", "a"),
  })
  tr.notOk("A:nth-child(-n) {}", {
    message: messages.expected("A", "a"),
  })
  tr.notOk("A { &:nth-child(3n + 1) {} }", {
    message: messages.expected("A", "a"),
  })
})

testRule("upper", tr => {

  tr.ok("A {}")

  tr.ok("A::before {}")
  tr.ok("&A {}")
  tr.ok("&LI {}")

  tr.ok(".foo {}")
  tr.ok("#bar {}")

  tr.ok(".FOO {}")
  tr.ok("#BAR {}")
  
  tr.ok("A.FOO {}")
  tr.ok("A B {}")
  tr.ok("A { & B {}}")
  tr.ok("A, B, * {}")
  
  tr.ok("A:nth-child(3n + 1) {}")
  tr.ok("A:nth-child(n) {}")
  tr.ok("A:nth-child(odd) {}")
  tr.ok("A:nth-child(even) {}")
  tr.ok("A:nth-child(-n) {}")
  tr.ok("A { &:nth-child(3n + 1) {} }")
  tr.ok("@keyframes spin { 0% {} }")
  tr.ok("@keyframes spin { to {} from {} }")
  tr.ok(":root { --custom-property-set: {} }")

  tr.notOk("a {}", {
    message: messages.expected("a", "A"),
  })
  tr.notOk("div::before {}", {
    message: messages.expected("div", "DIV"),
  })
  tr.notOk("a B {}", {
    message: messages.expected("a", "A"),
  })
  tr.notOk("a { & B {}}", {
    message: messages.expected("a", "A"),
  })
  tr.notOk("a:nth-child(even) {}", {
    message: messages.expected("a", "A"),
  })
  tr.notOk("a:nth-child(-n) {}", {
    message: messages.expected("a", "A"),
  })
  tr.notOk("a { &:nth-child(3n + 1) {} }", {
    message: messages.expected("a", "A"),
  })
})
