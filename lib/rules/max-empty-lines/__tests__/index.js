"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [1],

  accept: [
    {
      code: "a {}\nb {}"
    },
    {
      code: "a {}\r\nb {}"
    },
    {
      code: "a {}\n\nb{}"
    },
    {
      code: "a {}\r\n\r\nb{}"
    },
    {
      code: "/** horse */\n\nb{}"
    },
    {
      code: "/** horse */\r\n\r\nb{}"
    },
    {
      code: "a{}\n\n/** horse */\n\nb{}"
    },
    {
      code: "a{}\r\n\r\n/** horse */\r\n\r\nb{}"
    }
  ],

  reject: [
    {
      code: "a {}\n\n\nb{}",
      message: messages.expected(1),
      line: 4,
      column: 1
    },
    {
      code: "a {}\r\n\r\n\r\nb{}",
      message: messages.expected(1),
      line: 4,
      column: 1
    },
    {
      code: "a {}\n\n/** horse */\n\n\nb{}",
      message: messages.expected(1),
      line: 6,
      column: 1
    },
    {
      code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\nb{}",
      message: messages.expected(1),
      line: 6,
      column: 1
    },
    {
      code: "/* horse\n\n\n */\na{}",
      message: messages.expected(1),
      line: 4,
      column: 1
    },
    {
      code: "/* horse\r\n\r\n\r\n */\r\na{}",
      message: messages.expected(1),
      line: 4,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [1],
  syntax: "html",

  accept: [
    {
      code: `<div>




<style>
/* horse */
</style>



</div>`
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2],

  accept: [
    {
      code: "a {}\nb {}"
    },
    {
      code: "a {}\n\nb {}"
    },
    {
      code: "a {}\n\n\nb {}"
    },
    {
      code: "a {}\r\n\r\n\r\nb{}"
    },
    {
      code: "a{}\n\n\n/** horse */\n\n\nb{}"
    },
    {
      code: "a{}\r\n\r\n\r\n/** horse */\r\n\r\n\r\nb{}"
    }
  ],

  reject: [
    {
      code: "a {}\n\n\n\nb{}",
      message: messages.expected(2),
      line: 5,
      column: 1
    },
    {
      code: "a {}\r\n\r\n\r\n\r\nb{}",
      message: messages.expected(2),
      line: 5,
      column: 1
    },
    {
      code: "a {}\n\n/** horse */\n\n\n\nb{}",
      message: messages.expected(2),
      line: 7,
      column: 1
    },
    {
      code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\n\r\nb{}",
      message: messages.expected(2),
      line: 7,
      column: 1
    },
    {
      code: "/* horse\n\n\n\n */\na{}",
      message: messages.expected(2),
      line: 5,
      column: 1
    },
    {
      code: "/* horse\r\n\r\n\r\n\r\n */\r\na{}",
      message: messages.expected(2),
      line: 5,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2],
  skipBasicChecks: true,
  syntax: "scss",

  accept: [
    {
      code: "// one\n\n\n// two\n"
    }
  ],

  reject: [
    {
      code: "// one\n\n\n\n// two\n",
      message: messages.expected(2),
      line: 5,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2, { ignore: "comments" }],

  accept: [
    {
      code: "a{}\r\n\r\n/*\n\n\n\nhorse */\r\n\r\nb{}"
    },
    {
      code: "a{}\r\n\r\n/** \r\n\r\n\r\n\nhor\r\n\r\n\r\nse */\r\n\r\nb{}"
    },
    {
      code:
        "a{\r\n display: block;\r\n /* \r\n\r\n\r\nsome long comments */}\r\n\r\n"
    },
    {
      code:
        "a{\r\n display: block\r\n /* \r\n\r\n\r\nsome long comments */;}\r\n\r\n"
    },
    {
      code:
        "a{\r\n display: \r\n /* some long comments \r\n\r\n\r\n*/block;}\r\n\r\n"
    }
  ],

  reject: [
    {
      code: "a {}\r\n\r\n\n\n/**\n\n\nhorse */\r\n\r\n\r\n\r\nb{}",
      message: messages.expected(2),
      line: 12,
      column: 1
    }
  ]
});
