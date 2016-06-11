import { mergeTestDescriptions, testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

const sharedAlwaysTests = {
  accept: [ {
    code: "a {} b {}",
    description: "rule ignored",
  }, {
    code: "@font-face {}",
    description: "first node ignored",
  }, {
    code: "a {}\n\n@media {}",
  }, {
    code: "a {}\n\n@mEdIa {}",
  }, {
    code: "a {}\n\n@MEDIA {}",
  }, {
    code: "@keyframes foo {}\n\n@media {}",
  }, {
    code: "@kEyFrAmEs foo {}\n\n@MeDia {}",
  }, {
    code: "@KEYFRAMES foo {}\n\n@MEDIA {}",
  }, {
    code: "a {}\r\n\r\n@media {}",
    description: "windows",
  }, {
    code: "a {}\n\r\n@media {}",
    description: "mixed",
  } ],

  reject: [ {
    code: "a {} @media {}",
    message: messages.expected,
  }, {
    code: "a {} @mEdIa {}",
    message: messages.expected,
  }, {
    code: "a {} @MEDIA {}",
    message: messages.expected,
  }, {
    code: "@keyframes foo {} @media {}",
    message: messages.expected,
  }, {
    code: "a {}\n@media {}",
    message: messages.expected,
  }, {
    code: "a {}\r\n@media {}",
    message: messages.expected,
  }, {
    code: "a {}\n\n/* comment */\n@media {}",
    message: messages.expected,
  }, {
    code: "a {}\r\n\r\n/* comment */\r\n@media {}",
    message: messages.expected,
  } ],
}

const sharedNeverTests = {
  accept: [ {
    code: "a {}\n\nb {}",
    description: "rule ignored",
  }, {
    code: "\n\n@font-face {}",
    description: "first node ignored",
  }, {
    code: "a {}\n@media {}",
  }, {
    code: "a {} @media {}",
  }, {
    code: "@keyframes foo {}\n@media {}",
  }, {
    code: "@keyframes foo {} @media {}",
  } ],

  reject: [ {
    code: "a {}\n\n@media {}",
    message: messages.rejected,
  }, {
    code: "@keyframes foo {}\n/* comment */\n\n@media {}",
    message: messages.rejected,
  } ],
}

testRule(rule, mergeTestDescriptions(sharedAlwaysTests, {
  ruleName,
  config: ["always"],

  accept: [{
    code: "a {\n\n  @mixin foo;\n}",
  }],
}))

testRule(rule, mergeTestDescriptions(sharedAlwaysTests, {
  ruleName,
  config: [ "always", { except: ["blockless-group"] } ],

  accept: [ {
    code: "a {\n\n  @mixin foo;\n}",
  }, {
    code: "@keyframes foo {}\n\n@import 'x.css'",
    description: "empty line not blockless pair",
  }, {
    code: "@import 'x.css';\n@import 'y.css'",
    description: "no empty line blockless pair",
  }, {
    code: "@import 'x.css';",
    description: "single blockless rule",
  } ],

  reject: [ {
    code: "@keyframes foo {}\n@import 'x.css'",
    message: messages.expected,
  }, {
    code: "@import 'x.css';\n\n@import 'y.css'",
    message: messages.rejected,
  } ],
}))

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["blockless-group"] } ],

  accept: [{
    code: "@media {}; @import 'x.css';",
  }],

  reject: [ {
    code: "@import 'x.css'; @media {};",
    message: messages.expected,
  }, {
    code: "@import 'test'; @include mixin(1) { @content; };",
    message: messages.expected,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],

  accept: [ {
    code: "/* foo */\n@media {}",
  }, {
    code: "/* foo */\n\n@media{}",
  }, {
    code: "/* foo */\r\n\r\n@media {}",
    description: "CRLF",
  } ],

  reject: [{
    code: "a {} @media {}",
    message: messages.expected,
  }],
})

testRule(rule, mergeTestDescriptions(sharedAlwaysTests, {
  ruleName,
  config: [ "always", { except: ["all-nested"] } ],

  accept: [ {
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n  color: pink;\n  @mixin foo;\n}",
  } ],

  reject: [ {
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
    message: messages.rejected,
  }, {
    code: "a {\n\n  color: pink;\n\n  @mixin foo;\n}",
    message: messages.rejected,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedAlwaysTests, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],

  accept: [{
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
  }],

  reject: [ {
    code: "a {\n  color: pink;\n  @mixin foo;\n}",
    message: messages.expected,
  }, {
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
    message: messages.rejected,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedAlwaysTests, {
  ruleName,
  config: [ "always", { ignore: ["all-nested"] } ],

  accept: [ {
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n  color: pink;\n  @mixin foo;\n}",
  }, {
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n\n  color: pink;\n\n  @mixin foo;\n}",
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedAlwaysTests, {
  ruleName,
  config: [ "always", { except: [ "blockless-group", "all-nested" ] } ],

  accept: [ {
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n  color: pink;\n  @mixin foo;\n}",
  }, {
    code: "@keyframes foo {}\n\n@import 'x.css'",
    description: "empty line not blockless pair",
  }, {
    code: "@import 'x.css';\n@import 'y.css'",
    description: "no empty line blockless pair",
  }, {
    code: "@import 'x.css';",
    description: "single blockless rule",
  }, {
    code: "a {\n  @mixin foo;\n  @mixin bar;\n}",
  } ],

  reject: [ {
    code: "@keyframes foo {}\n@import 'x.css'",
    message: messages.expected,
  }, {
    code: "@import 'x.css';\n\n@import 'y.css'",
    message: messages.rejected,
  }, {
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
    message: messages.rejected,
  }, {
    code: "a {\n\n  color: pink;\n\n  @mixin foo;\n}",
    message: messages.rejected,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedNeverTests, {
  ruleName,
  config: ["never"],

  accept: [{
    code: "a {\n  @mixin foo;\n}",
  }],
}))

testRule(rule, mergeTestDescriptions(sharedNeverTests, {
  ruleName,
  config: [ "never", { except: ["blockless-group"] } ],

  accept: [ {
    code: "a {\n  @mixin foo;\n}",
  }, {
    code: "@keyframes foo {}\n@import 'x.css'",
    description: "no empty line not blockless pair",
  }, {
    code: "@import 'x.css';\n\n@import 'y.css'",
    description: "empty line blockless pair",
  }, {
    code: "@import 'x.css';",
    description: "single blockless rule",
  } ],

  reject: [ {
    code: "@keyframes foo {}\n\n@import 'x.css'",
    message: messages.rejected,
  }, {
    code: "@import 'x.css';\n@import 'y.css'",
    message: messages.expected,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedNeverTests, {
  ruleName,
  config: [ "never", { except: ["all-nested"] } ],

  accept: [ {
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n  color: pink;\n\n  @mixin foo;\n}",
  } ],

  reject: [ {
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
    message: messages.expected,
  }, {
    code: "a {\n\n  color: pink;\n  @mixin foo;\n}",
    message: messages.expected,
  } ],
}))

testRule(rule, mergeTestDescriptions(sharedNeverTests, {
  ruleName,
  config: [ "never", { except: ["first-nested"] } ],

  accept: [{
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
  }],

  reject: [ {
    code: "a {\n  color: pink;\n\n  @mixin foo;\n}",
    message: messages.rejected,
  }, {
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
    message: messages.expected,
  } ],
}))

testRule(rule, {
  ruleName,
  config: [ "never", { ignore: ["blockless-group"] } ],

  accept: [ {
    code: `
      @media {};

      @import 'x.css';
    `,
  }, {
    code: `
      @import 'x.css';

      @import 'y.css';
    `,
  } ],

  reject: [{
    code: `
      @import 'x.css';

      @media {};
    `,
    message: messages.rejected,
    line: 4,
    column: 7,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "never", { ignore: ["after-comment"] } ],

  accept: [ {
    code: "/* foo */\n@media {}",
  }, {
    code: "/* foo */\r\na@media {}",
    description: "CRLF",
  }, {
    code: "/* foo */\n\n@media {}",
  } ],

  reject: [ {
    code: "b {}\n\n@media {}",
    message: messages.rejected,
  }, {
    code: "b {}\r\n\r\n@media {}",
    description: "CRLF",
    message: messages.rejected,
  } ],
})

testRule(rule, mergeTestDescriptions(sharedNeverTests, {
  ruleName,
  config: [ "never", { ignore: ["all-nested"] } ],

  accept: [ {
    code: "a {\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n  color: pink;\n  @mixin foo;\n}",
  }, {
    code: "a {\n\n  @mixin foo;\n  color: pink;\n}",
  }, {
    code: "a {\n\n  color: pink;\n\n  @mixin foo;\n}",
  } ],
}))

testRule(rule, {
  ruleName,
  config: [ "always", { ignoreAtRules: ["else"] } ],

  accept: [ {
    code: `
      @if(true) {
      } @else {
      }
    `,
  }, {
    code: `
      @if(true) {
      }

      @else {
      }
    `,
  }, {
    code: `
      @if(true) {}
      @else if(true) {
      }  @else {
      }
    `,
  } ],

  reject: [ {
    code: `
      @if(true) {
      } @else-mixin {
      }
    `,
    message: messages.expected,
    line: 3,
    column: 9,
  }, {
    code: `
      @if (true) {}
      @if (false) {
      }
    `,
    message: messages.expected,
    line: 3,
    column: 7,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignoreAtRules: "/fo/" } ],

  accept: [ {
    code: "@keyframes {}; @before-mixin();",
  }, {
    code: `
      @if true {}
      @for ... {
      }
    `,
  } ],

  reject: [{
    code: `
      @for ... {
        color: pink;
      }
      @if true {}
    `,
    message: messages.expected,
    line: 5,
    column: 7,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "never", { ignoreAtRules: ["else"] } ],

  accept: [ {
    code: `
      @if(true) {
      } @else {
      }
    `,
  }, {
    code: `
      @if(true) {
      }

      @else {
      }
    `,
  }, {
    code: `
      @if(true) {}

      @else if(true) {}

      @else {}
    `,
  } ],

  reject: [ {
    code: `
      @if(true) {
      }

      @else-mixin {}
    `,
    message: messages.rejected,
    line: 5,
    column: 7,
  }, {
    code: `
      @if (true)
      {}

      @if (false) {
      }
    `,
    message: messages.rejected,
    line: 5,
    column: 7,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { ignoreAtRules: "/fo/" } ],

  accept: [ {
    code: `
      @keyframes {}

      @before-mixin();
    `,
  }, {
    code: `
      @if true {}

      @for ... {
      }
    `,
  } ],

  reject: [{
    code: `
      @for ... {
        color: pink;
      }

      @if true {}
    `,
    message: messages.rejected,
    line: 6,
    column: 7,
  }],
})
