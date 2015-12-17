import { ruleTester } from "../testUtils"
import blockNoEmpty, {
  ruleName as blockNoEmptyName,
  messages as blockNoEmptyMessages,
} from "../rules/block-no-empty"
import selectorCombinatorSpaceBefore, {
  ruleName as selectorCombinatorSpaceBeforeName,
  messages as selectorCombinatorSpaceBeforeMessages,
} from "../rules/selector-combinator-space-before"
import maxLineLength, {
  ruleName as maxLineLengthName,
  messages as maxLineLengthMessages,
} from "../rules/max-line-length"
import stringQuotes, {
  ruleName as stringQuotesName,
  messages as stringQuotesMessages,
} from "../rules/string-quotes"

const testBlockNoEmpty = ruleTester(blockNoEmpty, blockNoEmptyName)
const testSelectorCombinatorSpaceBefore = ruleTester(selectorCombinatorSpaceBefore, selectorCombinatorSpaceBeforeName)
const testMaxLineLength = ruleTester(maxLineLength, maxLineLengthName)
const testStringQuotes = ruleTester(stringQuotes, stringQuotesName)

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
  tr.ok(`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    /* stylelint-disable */
    a {}
  `)

  tr.notOk(`
    /* stylelint-disable */
    a {}
    /* stylelint-enable */
    a {}
  `, blockNoEmptyMessages.rejected)
})

// max-line-length is important to test because the node it attaches its warning
// to is the root
testMaxLineLength(80, tr => {
  tr.ok(`
    /* stylelint-disable */
    .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    /* stylelint-enable */
  `)
  tr.ok(`
    /* stylelint-disable max-line-length */
    .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    /* stylelint-enable max-line-length */
  `)
  tr.notOk(`
    /* stylelint-disable block-no-empty */
    .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    /* stylelint-enable block-no-empty */
  `, maxLineLengthMessages.expected(80))
  tr.notOk(`
    /* stylelint-disable max-line-length */
    .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    /* stylelint-enable max-line-length */
    .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
  `, maxLineLengthMessages.expected(80))
})

// Same goes for string-quotes
testStringQuotes("single", tr => {
  tr.ok(`
    /* stylelint-disable */
    .foo { content: "horse"; }
    /* stylelint-enable */
  `)
  tr.ok(`
    /* stylelint-disable string-quotes */
    .foo { content: "horse"; }
    /* stylelint-enable string-quotes */
  `)
  tr.notOk(`
    /* stylelint-disable block-no-empty */
    .foo { content: "horse"; }
    /* stylelint-enable block-no-empty */
  `, stringQuotesMessages.expected("single"))
  tr.notOk(`
    /* stylelint-disable string-quotes */
    .foo { content: "horse"; }
    /* stylelint-enable string-quotes */
    .foo { content: "horse"; }
  `, stringQuotesMessages.expected("single"))
})
