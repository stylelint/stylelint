import { ruleTester } from "../testUtils"
import blockNoEmpty, {
  ruleName as blockNoEmptyName,
  messages as blockNoEmptyMessages,
} from "../rules/block-no-empty"
import selectorCombinatorSpaceBefore, {
  ruleName as selectorCombinatorSpaceBeforeName,
  messages as selectorCombinatorSpaceBeforeMessages,
} from "../rules/selector-combinator-space-before"

const testBlockNoEmpty = ruleTester(blockNoEmpty, blockNoEmptyName)
const testSelectorCombinatorSpaceBefore = ruleTester(selectorCombinatorSpaceBefore, selectorCombinatorSpaceBeforeName)

// disabling all rules
testBlockNoEmpty(undefined, tr => {
  tr.notOk("a {}", blockNoEmptyMessages.rejected)

  tr.ok("/* stylelint-disable */\na {}")

  tr.notOk("a {}\n/* stylelint-disable */", blockNoEmptyMessages.rejected)
  tr.ok("b { color: pink;}\n/* stylelint-disable */\na {}")
})

testSelectorCombinatorSpaceBefore("always", tr => {
  tr.notOk("a> b {}", selectorCombinatorSpaceBeforeMessages.expectedBefore(">"))
})

// disabling specific rules
testBlockNoEmpty(undefined, tr => {
  tr.ok(`/* stylelint-disable ${blockNoEmptyName} */\na {}`)
  tr.notOk("/* stylelint-disable declaration-no-important */\na {}",
    blockNoEmptyMessages.rejected)
})

testSelectorCombinatorSpaceBefore("always", tr => {
  tr.ok(`/* stylelint-disable declaration-no-important, selector-combinator-space-before */ a> b {}`)
  tr.notOk(`/* stylelint-disable declaration-no-important */ a> b {}`,
    selectorCombinatorSpaceBeforeMessages.expectedBefore(">"))
})

// multiple disabled ranges
testBlockNoEmpty(undefined, tr => {
  tr.ok(
    "/* stylelint-disable */\n" +
    "a {}\n" +
    "/* stylelint-enable */\n" +
    "/* stylelint-disable */\n" +
    "a {}\n"
  )

  tr.notOk(
    "/* stylelint-disable */\n" +
    "a {}\n" +
    "/* stylelint-enable */\n" +
    "a {}\n",
    blockNoEmptyMessages.rejected
  )
})
