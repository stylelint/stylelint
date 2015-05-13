import assert from "assert"
import ruleMessages from "./ruleMessages"

export default function (ruleName, messages) {
  assert(isFunction(messages.expectedBefore), err("expectedBefore"))
  assert(isFunction(messages.rejectedBefore), err("rejectedBefore"))
  assert(isFunction(messages.expectedAfter), err("expectedAfter"))
  assert(isFunction(messages.rejectedAfter), err("rejectedAfter"))
  return ruleMessages(ruleName, messages)
}

function err(x) {
  return `The messages object passed to standardWhitespaceMessages must have a ${x} function`
}

function isFunction(x) {
  return typeof x === "function"
}
