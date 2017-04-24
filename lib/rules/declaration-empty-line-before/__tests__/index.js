"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],
  fix: true,

  accept: [ {
    code: "a {\n\n top: 15px;\n}",
  }, {
    code: "a {\n\n\n\n top: 15px;\n}",
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n}",
  }, {
    code: "a{\n\n top: 15px; }",
  }, {
    code: "a{\n\n top: 15px;\r\n\r\n bottom: 5px;}",
  }, {
    code: "a{\n\n top: 15px;\n\r\n bottom: 5px;}",
  }, {
    code: "a{\n --custom-prop: value;\n\r\n top: 15px;}",
  }, {
    code: "a{\n @extends .class;\n\r\n top: 15px;}",
  }, {
    code: "a{\n $var: 15px;\n\r\n top: 15px;}",
  } ],

  reject: [ {
    code: "a { top: 15px; }",
    fixed: "a {\n\n top: 15px; }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a {\ntop: 15px;\n}",
    fixed: "a {\n\ntop: 15px;\n}",
    message: messages.expected,
    line: 2,
    column: 1,
  }, {
    code: "a {\r\n top: 15px;\r\n}",
    fixed: "a {\r\n\r\n top: 15px;\r\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }, {
    code: "a{\n\n top: 15px; \n bottom: 5px;}",
    fixed: "a{\n\n top: 15px; \n\n bottom: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\r\n\r\n top: 15px;\r\n bottom: 5px;}",
    fixed: "a{\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n --custom-prop: value;\n top: 15px;}",
    fixed: "a{\n --custom-prop: value;\n\n top: 15px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\r\n @extends .class;\r\n top: 15px;}",
    fixed: "a{\r\n @extends .class;\r\n\r\n top: 15px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\n $var: 15px;\n top: 15px;}",
    fixed: "a{\n $var: 15px;\n\n top: 15px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  fix: true,

  accept: [ {
    code: "a {\n\n #{var}: 15px;\n}",
  }, {
    code: "a{\n\n #{var}: 15px;\r\n\r\n prop#{var2}: 5px;}",
  }, {
    code: "a{\n\n top: 15px;\n\r\n #{var}: 5px;}",
  } ],

  reject: [ {
    code: "a { #{var}: 15px; }",
    fixed: "a {\n\n #{var}: 15px; }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a{\n\n top: 15px; \n #{var}: 5px;}",
    fixed: "a{\n\n top: 15px; \n\n #{var}: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\r\n\r\n #{var}: 15px;\r\n prop#{var2}: 5px;}",
    fixed: "a{\r\n\r\n #{var}: 15px;\r\n\r\n prop#{var2}: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n $var: 15px;\n #{var}: 15px;}",
    fixed: "a{\n $var: 15px;\n\n #{var}: 15px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "less",
  fix: true,

  accept: [ {
    code: "a {\n\n @{var}: 15px;\n}",
  }, {
    code: "a{\n\n @{var}: 15px;\r\n\r\n prop@{var2}: 5px;}",
  }, {
    code: "a{\n\n top: 15px;\n\r\n @{var}: 5px;}",
  } ],

  reject: [ {
    code: "a { @{var}: 15px; }",
    fixed: "a {\n\n @{var}: 15px; }",
    message: messages.expected,
    line: 1,
    column: 5,
  }, {
    code: "a{\n\n top: 15px; \n @{var}: 5px;}",
    fixed: "a{\n\n top: 15px; \n\n @{var}: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\r\n\r\n @{var}: 15px;\r\n prop@{var2}: 5px;}",
    fixed: "a{\r\n\r\n @{var}: 15px;\r\n\r\n prop@{var2}: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n $var: 15px;\n @{var}: 15px;}",
    fixed: "a{\n $var: 15px;\n\n @{var}: 15px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["inside-single-line-block"] } ],
  fix: true,

  accept: [ {
    code: "a { top: 15px; }",
  }, {
    code: "a {\n\n top: 15px;\n}",
  } ],

  reject: [{
    code: "a {\n top: 15px;\n}",
    fixed: "a {\n\n top: 15px;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],
  fix: true,

  accept: [ {
    code: "a {\n/* comment */ top: 15px;\n}",
  }, {
    code: "a {\n/* comment */\ntop: 15px;\n}",
  }, {
    code: "a {\r\n/* comment */\r\ntop: 15px;\r\n}",
  } ],

  reject: [{
    code: "a {\n top: 15px;\n}",
    fixed: "a {\n\n top: 15px;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-declaration"] } ],
  fix: true,

  accept: [ {
    code: "a {\n\n top: 15px; bottom: 5px;\n}",
  }, {
    code: "a {\r\n\r\n top: 15px; bottom: 5px;\r\n}",
  }, {
    code: "a {\n\n top: 15px;\n bottom: 5px;\n}",
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n bottom: 5px;\r\n}",
  }, {
    code: "a {\n\n top: 15px;\n\n bottom: 5px;\n}",
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;\r\n}",
  } ],

  reject: [ {
    code: "a{\n @extends .class;\n top: 15px;\n}",
    fixed: "a{\n @extends .class;\n\n top: 15px;\n}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\r\n @extends .class;\r\n top: 15px;\r\n}",
    fixed: "a{\r\n @extends .class;\r\n\r\n top: 15px;\r\n}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\n @include mixin;\n top: 15px;\n}",
    fixed: "a{\n @include mixin;\n\n top: 15px;\n}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\r\n @include mixin;\r\n top: 15px;\r\n}",
    fixed: "a{\r\n @include mixin;\r\n\r\n top: 15px;\r\n}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a {\n top: 15px;\n}",
    fixed: "a {\n\n top: 15px;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }, {
    code: "a {\r\n top: 15px;\r\n}",
    fixed: "a {\r\n\r\n top: 15px;\r\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],
  fix: true,

  accept: [ {
    code: "a { top: 15px;\n}",
  }, {
    code: "a {\n top: 15px;\n}",
  }, {
    code: "a {\r\n top: 15px;\r\n}",
  } ],

  reject: [ {
    code: "a {\n\n top: 15px;\n}",
    fixed: "a {\n top: 15px;\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n}",
    fixed: "a {\r\n top: 15px;\r\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-comment"] } ],
  fix: true,

  accept: [ {
    code: "a {\n\n top: 15px;\n}",
  }, {
    code: "a {/* I am a comment */ \n bottom: 5px;}",
  }, {
    code: "a {/* I am a comment */ \r\n bottom: 5px;}",
  } ],

  reject: [ {
    code: "a {\n\n top: 15px;\n /* I am a comment */ \n\n bottom: 5px;}",
    fixed: "a {\n\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}",
    message: messages.rejected,
    line: 6,
    column: 2,
  }, {
    code: "a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}",
    fixed: "a {\r\n /* I am a comment */ \r\n bottom: 5px;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-declaration"] } ],
  fix: true,

  accept: [ {
    code: "a {\n\n top: 15px;\n}",
  }, {
    code: "a {\n\n top:15px; \n bottom: 5px;}",
  }, {
    code: "a {\n\n top:15px; \r\n bottom: 5px;}",
  } ],

  reject: [ {
    code: "a {\n\n top:15px;\n\n bottom: 5px;}",
    fixed: "a {\n\n top:15px;\n bottom: 5px;}",
    message: messages.rejected,
    line: 5,
    column: 2,
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n\r\n bottom: 5px;}",
    fixed: "a {\r\n\r\n top: 15px;\r\n bottom: 5px;}",
    message: messages.rejected,
    line: 5,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-declaration"] } ],
  syntax: "scss",
  fix: true,

  accept: [ {
    code: "a {\n\n #{$var}: 15px;\n}",
  }, {
    code: "a {\n\n top:15px; \n #{$var}: 5px; }",
  } ],

  reject: [ {
    code: "a {\n\n top:15px;\n\n #{$var}: 5px; }",
    fixed: "a {\n\n top:15px;\n #{$var}: 5px; }",
    message: messages.rejected,
    line: 5,
    column: 2,
  }, {
    code: "a {\r\n\r\n prop#{$var}erty: 15px;\r\n\r\n #{$var2}: 5px; }",
    fixed: "a {\r\n\r\n prop#{$var}erty: 15px;\r\n #{$var2}: 5px; }",
    message: messages.rejected,
    line: 5,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-declaration"] } ],
  syntax: "less",
  fix: true,

  accept: [ {
    code: "a {\n\n @{var}: 15px;\n}",
  }, {
    code: "a {\n\n top:15px; \n @{var}: 5px; }",
  } ],

  reject: [ {
    code: "a {\n\n top:15px;\n\n @{var}: 5px; }",
    fixed: "a {\n\n top:15px;\n @{var}: 5px; }",
    message: messages.rejected,
    line: 5,
    column: 2,
  }, {
    code: "a {\r\n\r\n prop@{var}erty: 15px;\r\n\r\n @{var2}: 5px; }",
    fixed: "a {\r\n\r\n prop@{var}erty: 15px;\r\n @{var2}: 5px; }",
    message: messages.rejected,
    line: 5,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", {
    except: [ "first-nested", "after-comment", "after-declaration" ] } ],
  fix: true,

  accept: [{ code: "a {\n top: 15px; \n bottom: 5px; \n /* comment */ \n prop: 15px;\n\n @extends 'x';\n\n prop: 15px; \n & b {\n prop: 15px;\n } \n\n prop: 15px; \n }" }],
})

testRule(rule, {
  ruleName,
  config: ["never"],
  fix: true,

  accept: [ {
    code: "a { top: 15px;\n}",
  }, {
    code: "a {\n top: 15px;\n}",
  }, {
    code: "a {\r\n top: 15px;\r\n}",
  }, {
    code: "a {\n top: 15px; bottom: 5px;\n}",
  }, {
    code: "a {\n top: 15px; \n bottom: 5px; }",
  }, {
    code: "a {\n/* comment */ \n top3: 15px; \n\n }",
  }, {
    code: "a{\n --custom-prop: value;\n top: 15px;}",
  }, {
    code: "a{\n @extends .class;\n top: 15px;}",
  }, {
    code: "a{\n $var: 15px;\n top: 15px;}",
  } ],

  reject: [ {
    code: "a {\n\n top: 15px;\n}",
    fixed: "a {\n top: 15px;\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n}",
    fixed: "a {\r\n top: 15px;\r\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a{\n bottom: 5px;\n\n top: 15px;}",
    fixed: "a{\n bottom: 5px;\n top: 15px;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n --custom-prop: value;\n\n top: 15px;}",
    fixed: "a{\n --custom-prop: value;\n top: 15px;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a{\r\n @extends .class;\r\n\r\n top: 15px;}",
    fixed: "a{\r\n @extends .class;\r\n top: 15px;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n $var: 15px;\n\n top: 15px;}",
    fixed: "a{\n $var: 15px;\n top: 15px;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { except: ["first-nested"] } ],
  fix: true,

  accept: [ {
    code: "a {\n\n top: 15px;\n}",
  }, {
    code: "a {\n\n top: 15px;\n bottom: 5px;}",
  }, {
    code: "a {\r\n\r\n top: 15px;\r\n}",
  } ],

  reject: [ {
    code: "a {\n\n top: 15px;\n\nbottom:5px; }",
    fixed: "a {\n\n top: 15px;\nbottom:5px; }",
    message: messages.rejected,
    line: 5,
    column: 1,
  }, {
    code: "a {\n top: 15px;\n}",
    fixed: "a {\n\n top: 15px;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }, {
    code: "a {\r\n top: 15px;\r\n}",
    fixed: "a {\r\n\r\n top: 15px;\r\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { except: ["after-comment"] } ],
  fix: true,

  accept: [ {
    code: "a {\n top: 15px;\n}",
  }, {
    code: "a {/* I am a comment */ \n\n bottom: 5px;}",
  }, {
    code: "a {/* I am a comment */ \r\n\r\n bottom: 5px;}",
  } ],

  reject: [ {
    code: "a {\n/* I am a comment */ \n\n bottom: 5px;\n\ntop: 15px;}",
    fixed: "a {\n/* I am a comment */ \n\n bottom: 5px;\ntop: 15px;}",
    message: messages.rejected,
    line: 6,
    column: 1,
  }, {
    code: "a {\n top: 15px;\n /* I am a comment */ \n bottom: 5px;}",
    fixed: "a {\n top: 15px;\n /* I am a comment */ \n\n bottom: 5px;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a {\r\n /* I am a comment */ \r\n bottom: 5px;}",
    fixed: "a {\r\n /* I am a comment */ \r\n\r\n bottom: 5px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { except: ["after-declaration"] } ],
  fix: true,

  accept: [ {
    code: "a {\n top: 15px;\n}",
  }, {
    code: "a {\n top:15px; \n\n bottom: 5px;}",
  }, {
    code: "a {\n top:15px; \r\n\r\n bottom: 5px;}",
  } ],

  reject: [ {
    code: "a {\n\n top:15px;\n\nbottom: 5px;}",
    fixed: "a {\n top:15px;\n\nbottom: 5px;}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a {\n top:15px;\nbottom: 5px;}",
    fixed: "a {\n top:15px;\n\nbottom: 5px;}",
    message: messages.expected,
    line: 3,
    column: 1,
  }, {
    code: "a {\n top: 15px;\n bottom: 5px;}",
    fixed: "a {\n top: 15px;\n\n bottom: 5px;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", {
    except: [ "first-nested", "after-comment", "after-declaration" ] } ],
  fix: true,

  accept: [{ code: "a {\n\n top: 15px; \n\n bottom: 5px; \n /* comment */ \n\n prop: 15px;\n\n @extends 'x';\n prop: 15px; \n & b {\n\n prop: 15px;\n } \n prop: 15px; \n }" }],

})
