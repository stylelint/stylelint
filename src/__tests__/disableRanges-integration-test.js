import blockNoEmpty, {
  messages as blockNoEmptyMessages,
  ruleName as blockNoEmptyName,
} from "../rules/block-no-empty"
import maxLineLength, {
  messages as maxLineLengthMessages,
  ruleName as maxLineLengthName,
} from "../rules/max-line-length"
import selectorCombinatorSpaceBefore, {
  messages as selectorCombinatorSpaceBeforeMessages,
  ruleName as selectorCombinatorSpaceBeforeName,
} from "../rules/selector-combinator-space-before"
import stringQuotes, {
  messages as stringQuotesMessages,
  ruleName as stringQuotesName,
} from "../rules/string-quotes"
import testRule from "../testUtils/testRule.js"

// disabling all rules
testRule(blockNoEmpty, {
  ruleName: blockNoEmptyName,
  config: [undefined],
  skipBasicChecks: true,

  accept: [ {
    code: "/* stylelint-disable */\na {}",
  }, {
    code: "/* stylelint-disable-line */ a {}",
  }, {
    code: "a {} /* stylelint-disable-line */ ",
  }, {
    code: "b { color: pink;}\n/* stylelint-disable */\na {}",
  } ],

  reject: [ {
    code: "a {}",
    message: blockNoEmptyMessages.rejected,
  }, {
    code: "a {}\n/* stylelint-disable */",
    message: blockNoEmptyMessages.rejected,
  }, {
    code: "a {}\n/* stylelint-disable-line */",
    message: blockNoEmptyMessages.rejected,
  }, {
    code: "/* stylelint-disable-line */\na {}",
    message: blockNoEmptyMessages.rejected,
  } ],
})

testRule(selectorCombinatorSpaceBefore, {
  ruleName: selectorCombinatorSpaceBeforeName,
  config: ["always"],
  skipBasicChecks: true,

  reject: [{
    code: "a> b {}",
    message: selectorCombinatorSpaceBeforeMessages.expectedBefore(">"),
  }],
})

testRule(blockNoEmpty, {
  ruleName: blockNoEmptyName,
  config: [undefined],
  skipBasicChecks: true,

  accept: [ {
    code: `/* stylelint-disable ${blockNoEmptyName} */\na {}`,
  }, {
    code: `/* stylelint-disable-line ${blockNoEmptyName} */ a {}`,
  }, {
    code: `a {} /* stylelint-disable-line ${blockNoEmptyName} */ `,
  } ],

  reject: [ {
    code: "/* stylelint-disable declaration-no-important */\na {}",
    message: blockNoEmptyMessages.rejected,
  }, {
    code: "/* stylelint-disable-line declaration-no-important */\na {}",
    message: blockNoEmptyMessages.rejected,
  }, {
    code: `/* stylelint-disable-line ${blockNoEmptyName} */ a {}\nb {}`,
    message: blockNoEmptyMessages.rejected,
    line: 2,
    column: 3,
  } ],
})

testRule(selectorCombinatorSpaceBefore, {
  ruleName: selectorCombinatorSpaceBeforeName,
  config: ["always"],
  skipBasicChecks: true,

  accept: [ {
    code: "/* stylelint-disable declaration-no-important, selector-combinator-space-before */ a> b {}",
  }, {
    code: "/* stylelint-disable-line declaration-no-important, selector-combinator-space-before */ a> b {}",
  }, {
    code: "a> b {} /* stylelint-disable-line declaration-no-important, selector-combinator-space-before */",
  } ],

  reject: [ {
    code: "/* stylelint-disable declaration-no-important */ a> b {}",
    message: selectorCombinatorSpaceBeforeMessages.expectedBefore(">"),
  }, {
    code: "/* stylelint-disable-line declaration-no-important */\na> b {}",
    message: selectorCombinatorSpaceBeforeMessages.expectedBefore(">"),
  } ],
})

testRule(blockNoEmpty, {
  ruleName: blockNoEmptyName,
  config: [undefined],
  skipBasicChecks: true,

  accept: [{
    code: `
      /* stylelint-disable */
      a {}
      /* stylelint-enable */
      /* stylelint-disable */
      a {}
    `,
  }],

  reject: [{
    code: `
      /* stylelint-disable */
      a {}
      /* stylelint-enable */
      a {}
    `,

    message: blockNoEmptyMessages.rejected,
  }],
})

testRule(maxLineLength, {
  ruleName: maxLineLengthName,
  config: [80],
  skipBasicChecks: true,

  accept: [ {
    code: `
      /* stylelint-disable */
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
      /* stylelint-enable */
    `,
  }, {
    code: `
      /* stylelint-disable-line */ .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    `,
  }, {
    code: `
      /* stylelint-disable max-line-length */
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
      /* stylelint-enable max-line-length */
    `,
  }, {
    code: `
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); } /* stylelint-disable-line max-line-length */
    `,
  } ],

  reject: [ {
    code: `
      /* stylelint-disable block-no-empty */
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
      /* stylelint-enable block-no-empty */
    `,

    message: maxLineLengthMessages.expected(80),
  }, {
    code: `
      /* stylelint-disable-line */
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    `,

    message: maxLineLengthMessages.expected(80),
  }, {
    code: `
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
      /* stylelint-disable-line */
    `,

    message: maxLineLengthMessages.expected(80),
  }, {
    code: `
      /* stylelint-disable max-line-length */
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
      /* stylelint-enable max-line-length */
      .abracadabracadabra { background: linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba (255, 255, 255, 1)); }
    `,

    message: maxLineLengthMessages.expected(80),
  } ],
})

testRule(stringQuotes, {
  ruleName: stringQuotesName,
  config: ["single"],
  skipBasicChecks: true,

  accept: [ {
    code: `
      /* stylelint-disable */
      .foo { content: "horse"; }
      /* stylelint-enable */
    `,
  }, {
    code: `
      /* stylelint-disable string-quotes */
      .foo { content: "horse"; }
      /* stylelint-enable string-quotes */
    `,
  } ],

  reject: [ {
    code: `
      /* stylelint-disable block-no-empty */
      .foo { content: "horse"; }
      /* stylelint-enable block-no-empty */
    `,

    message: stringQuotesMessages.expected("single"),
  }, {
    code: `
      /* stylelint-disable string-quotes */
      .foo { content: "horse"; }
      /* stylelint-enable string-quotes */
      .foo { content: "horse"; }
    `,

    message: stringQuotesMessages.expected("single"),
  } ],
})
