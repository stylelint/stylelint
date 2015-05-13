import assert from "assert"
import _ from "lodash"
import ruleMessages from "./ruleMessages"

export default function (ruleName, messages) {
  assert(_.isFunction(messages.expectedBefore), err("expectedBefore"))
  assert(_.isFunction(messages.rejectedBefore), err("rejectedBefore"))
  assert(_.isFunction(messages.expectedAfter), err("expectedAfter"))
  assert(_.isFunction(messages.rejectedAfter), err("rejectedAfter"))
  return ruleMessages(ruleName, messages)
}

function err(x) {
  return `The messages object passed to standardWhitespaceMessages must have a ${x} function`
}
