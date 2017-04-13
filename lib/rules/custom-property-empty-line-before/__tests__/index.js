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
    code: "a {\n\n --custom-prop: value;\n}",
  }, {
    code: "a {\r\n\r\n --custom-prop: value;\r\n}",
  }, {
    code: "a{\n\n --custom-prop: value; }",
  }, {
    code: "a{\n\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}",
  }, {
    code: "a{\n\n --custom-prop: value;\n\r\n --custom-prop2: value;}",
  }, {
    code: "a{\n top: 10px;\n\r\n --custom-prop: value;}",
  }, {
    code: "a{\n @extends .class;\n\r\n --custom-prop: value;}",
  }, {
    code: "a{\n $var: value;\n\r\n --custom-prop: value;}",
  } ],

  reject: [ {
    code: "a {\n--custom-prop: value;\n}",
    fixed: "a {\n\n--custom-prop: value;\n}",
    message: messages.expected,
    line: 2,
    column: 1,
  }, {
    code: "a {\r\n --custom-prop: value;\r\n}",
    fixed: "a {\r\n\r\n --custom-prop: value;\r\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }, {
    code: "a{\n\n --custom-prop: value; \n --custom-prop2: value;}",
    fixed: "a{\n\n --custom-prop: value; \n\n --custom-prop2: value;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;}",
    fixed: "a{\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n top: 10px;\n --custom-prop: value;}",
    fixed: "a{\n top: 10px;\n\n --custom-prop: value;}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\r\n @extends .class;\r\n --custom-prop: value;}",
    fixed: "a{\r\n @extends .class;\r\n\r\n --custom-prop: value;}",
    message: messages.expected,
    line: 3,
    column: 2,
  }, {
    code: "a{\n $var: value;\n --custom-prop: value;}",
    fixed: "a{\n $var: value;\n\n --custom-prop: value;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["after-comment"] } ],
  fix: true,

  accept: [ {
    code: "a {\n/* comment */ --custom-prop: value;\n}",
  }, {
    code: "a {\n/* comment */\n--custom-prop: value;\n}",
  }, {
    code: "a {\r\n/* comment */\r\nn--custom-prop: value;\r\n}",
  } ],

  reject: [{
    code: "a {\n --custom-prop: value;\n}",
    fixed: "a {\n\n --custom-prop: value;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "always", { ignore: ["inside-single-line-block"] } ],
  fix: true,

  accept: [ {
    code: "a { --custom-prop: value; }",
  }, {
    code: "a {\n\n --custom-prop: value;\n}",
  } ],

  reject: [{
    code: "a {\n --custom-prop: value;\n}",
    fixed: "a {\n\n --custom-prop: value;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["first-nested"] } ],
  fix: true,

  accept: [ {
    code: "a { --custom-prop: value;\n}",
  }, {
    code: "a {\n --custom-prop: value;\n}",
  }, {
    code: "a {\r\n --custom-prop: value;\r\n}",
  } ],

  reject: [ {
    code: "a {\n\n --custom-prop: value;\n}",
    fixed: "a {\n --custom-prop: value;\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a {\r\n\r\n --custom-prop: value;\r\n}",
    fixed: "a {\r\n --custom-prop: value;\r\n}",
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
    code: "a {\n\n --custom-prop: value;\n}",
  }, {
    code: "a {/* I am a comment */ \n --custom-prop2: value;}",
  }, {
    code: "a {/* I am a comment */ \r\n --custom-prop2: value;}",
  } ],

  reject: [ {
    code: "a {\n\n --custom-prop: value;\n /* I am a comment */ \n\n --custom-prop2: value;}",
    fixed: "a {\n\n --custom-prop: value;\n /* I am a comment */ \n --custom-prop2: value;}",
    message: messages.rejected,
    line: 6,
    column: 2,
  }, {
    code: "a {\r\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}",
    fixed: "a {\r\n /* I am a comment */ \r\n --custom-prop2: value;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", { except: ["after-custom-property"] } ],
  fix: true,

  accept: [ {
    code: "a {\n\n --custom-prop: value;\n}",
  }, {
    code: "a {\n\n --custom-prop:value; \n --custom-prop2: value;}",
  }, {
    code: "a {\n\n --custom-prop:value; \r\n --custom-prop2: value;}",
  } ],

  reject: [ {
    code: "a {\n\n --custom-prop:value;\n\n --custom-prop2: value;}",
    fixed: "a {\n\n --custom-prop:value;\n --custom-prop2: value;}",
    message: messages.rejected,
    line: 5,
    column: 2,
  }, {
    code: "a {\r\n\r\n --custom-prop: value;\r\n\r\n --custom-prop2: value;}",
    fixed: "a {\r\n\r\n --custom-prop: value;\r\n --custom-prop2: value;}",
    message: messages.rejected,
    line: 5,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "always", {
    except: [ "first-nested", "after-comment", "after-custom-property" ] } ],
  fix: true,

  accept: [{ code: "a {\n --custom-prop: value; \n --custom-prop2: value; \n /* comment */ \n --custom-prop3: value;\n\n @extends 'x';\n\n --custom-prop4: value; \n & b {\n prop: value;\n } \n\n --custom-prop5: value; \n }" }],

})

testRule(rule, {
  ruleName,
  config: ["never"],
  fix: true,

  accept: [ {
    code: "a {\n --custom-prop: value;\n}",
  }, {
    code: "a {\r\n --custom-prop: value;\r\n}",
  }, {
    code: "a {\n --custom-prop: value; \n --custom-prop2: value; \n\n /* comment */ \n --custom-prop3: value; \n\n @extends 'x'; \n --custom-prop4: value; \n\n & b {\n prop: value; \n } \n --custom-prop5: value;\n }",
  }, {
    code: "a{\n top: 10px;\n --custom-prop: value;}",
  }, {
    code: "a{\n @extends .class;\n --custom-prop: value;}",
  }, {
    code: "a{\n $var: value;\n --custom-prop: value;}",
  } ],

  reject: [ {
    code: "a {\n\n --custom-prop: value;\n}",
    fixed: "a {\n --custom-prop: value;\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a {\r\n\r\n --custom-prop: value;\r\n}",
    fixed: "a {\r\n --custom-prop: value;\r\n}",
    message: messages.rejected,
    line: 3,
    column: 2,
  }, {
    code: "a{\n top: 10px;\n\n --custom-prop: value;}",
    fixed: "a{\n top: 10px;\n --custom-prop: value;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a{\r\n @extends .class;\r\n\r\n --custom-prop: value;}",
    fixed: "a{\r\n @extends .class;\r\n --custom-prop: value;}",
    message: messages.rejected,
    line: 4,
    column: 2,
  }, {
    code: "a{\n $var: value;\n\n --custom-prop: value;}",
    fixed: "a{\n $var: value;\n --custom-prop: value;}",
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
    code: "a {\n\n --custom-prop: value;\n}",
  }, {
    code: "a {\n\n --custom-prop: value;\n}",
  }, {
    code: "a {\r\n\r\n --custom-prop: value;\r\n}",
  } ],

  reject: [ {
    code: "a {\n --custom-prop: value;\n}",
    fixed: "a {\n\n --custom-prop: value;\n}",
    message: messages.expected,
    line: 2,
    column: 2,
  }, {
    code: "a {\r\n --custom-prop: value;\r\n}",
    fixed: "a {\r\n\r\n --custom-prop: value;\r\n}",
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
    code: "a {\n --custom-prop: value;\n}",
  }, {
    code: "a {/* I am a comment */ \n\n --custom-prop2: value;}",
  }, {
    code: "a {/* I am a comment */ \r\n\r\n --custom-prop2: value;}",
  } ],

  reject: [ {
    code: "a {\n --custom-prop: value;\n /* I am a comment */ \n --custom-prop2: value;}",
    fixed: "a {\n --custom-prop: value;\n /* I am a comment */ \n\n --custom-prop2: value;}",
    message: messages.expected,
    line: 4,
    column: 2,
  }, {
    code: "a {\r\n /* I am a comment */ \r\n --custom-prop2: value;}",
    fixed: "a {\r\n /* I am a comment */ \r\n\r\n --custom-prop2: value;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", { except: ["after-custom-property"] } ],
  fix: true,

  accept: [ {
    code: "a {\n --custom-prop: value;\n}",
  }, {
    code: "a {\n --custom-prop:value; \n\n --custom-prop2: value;}",
  }, {
    code: "a {\n --custom-prop:value; \r\n\r\n --custom-prop2: value;}",
  } ],

  reject: [ {
    code: "a {\n --custom-prop:value;\n--custom-prop2: value;}",
    fixed: "a {\n --custom-prop:value;\n\n--custom-prop2: value;}",
    message: messages.expected,
    line: 3,
    column: 1,
  }, {
    code: "a {\n --custom-prop: value;\n --custom-prop2: value;}",
    fixed: "a {\n --custom-prop: value;\n\n --custom-prop2: value;}",
    message: messages.expected,
    line: 3,
    column: 2,
  } ],
})

testRule(rule, {
  ruleName,
  config: [ "never", {
    except: [ "first-nested", "after-comment", "after-custom-property" ] } ],
  fix: true,

  accept: [{ code: "a {\n\n --custom-prop: value; \n\n --custom-prop2: value; \n /* comment */ \n\n --custom-prop3: value;\n\n @extends 'x';\n --custom-prop4: value; \n & b {\n prop: value;\n } \n --custom-prop5: value; \n }" }],

})
