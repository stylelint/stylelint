import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [undefined],

  accept: [ {
    code: ":root {}",
  }, {
    code: ":rOoT {}",
  }, {
    code: ":ROOT {}",
  }, {
    code: "   :root\n {}",
  } ],

  reject: [ {
    code: "a, :root {}",
    message: messages.rejected,
  }, {
    code: "a, :rOoT {}",
    message: messages.rejected,
  }, {
    code: "a, :ROOT {}",
    message: messages.rejected,
  }, {
    code: ":root, a {}",
    message: messages.rejected,
  }, {
    code: ":root + a {}",
    message: messages.rejected,
  }, {
    code: "body, .foo, :root + a {}",
    message: messages.rejected,
  }, {
    code: "html:root {}",
    message: messages.rejected,
  }, {
    code: "html :root {}",
    message: messages.rejected,
  } ],
})
