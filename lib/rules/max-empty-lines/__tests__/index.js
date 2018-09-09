"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [1],

  accept: [
    {
      code: "\na {}"
    },
    {
      code: "\r\na {}"
    },
    {
      code: "a {}\n"
    },
    {
      code: "a {}\r\n"
    },
    {
      code: "a {}\nb {}"
    },
    {
      code: "a {}\r\nb {}"
    },
    {
      code: "a {}\n\nb {}"
    },
    {
      code: "a {}\r\n\r\nb {}"
    },
    {
      code: "/** horse */\n\nb {}"
    },
    {
      code: "/** horse */\r\n\r\nb {}"
    },
    {
      code: "a {}\n\n/** horse */\n\nb {}"
    },
    {
      code: "a {}\r\n\r\n/** horse */\r\n\r\nb {}"
    }
  ],

  reject: [
    {
      code: "\n\na {}",
      message: messages.expected(1),
      line: 2,
      column: 1
    },
    {
      code: "\r\n\r\na {}",
      message: messages.expected(1),
      line: 2,
      column: 1
    },
    {
      code: "a {}\n\n",
      message: messages.expected(1),
      line: 3,
      column: 1
    },
    {
      code: "a {}\r\n\r\n",
      message: messages.expected(1),
      line: 3,
      column: 1
    },
    {
      code: "a {}\n\n\nb {}",
      message: messages.expected(1),
      line: 3,
      column: 1
    },
    {
      code: "a {}\r\n\r\n\r\nb {}",
      message: messages.expected(1),
      line: 3,
      column: 1
    },
    {
      code: "a {}\n\n/** horse */\n\n\nb {}",
      message: messages.expected(1),
      line: 5,
      column: 1
    },
    {
      code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\nb {}",
      message: messages.expected(1),
      line: 5,
      column: 1
    },
    {
      code: "/* horse\n\n\n */\na {}",
      message: messages.expected(1),
      line: 3,
      column: 1
    },
    {
      code: "/* horse\r\n\r\n\r\n */\r\na {}",
      message: messages.expected(1),
      line: 3,
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
  ],

  reject: [
    {
      code: `<div>
<style>
/* horse */


</style>
</div>`,
      message: messages.expected(1),
      line: 5,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [1],
  syntax: "styled",

  accept: [
    {
      code: `
import styled from 'styled-components';





export default styled.div\`
  color: #00
\`;




`
    }
  ],

  reject: [
    {
      code: `
import styled from 'styled-components';
export default styled.div\`
  /* horse */


  color: #00
\`;
`,
      message: messages.expected(1),
      line: 6,
      column: 1
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
      code: "a {}\r\n\r\n\r\nb {}"
    },
    {
      code: "a {}\n\n\n/** horse */\n\n\nb {}"
    },
    {
      code: "a {}\r\n\r\n\r\n/** horse */\r\n\r\n\r\nb {}"
    }
  ],

  reject: [
    {
      code: "a {}\n\n\n\nb {}",
      message: messages.expected(2),
      line: 4,
      column: 1
    },
    {
      code: "a {}\r\n\r\n\r\n\r\nb {}",
      message: messages.expected(2),
      line: 4,
      column: 1
    },
    {
      code: "a {}\n\n/** horse */\n\n\n\nb {}",
      message: messages.expected(2),
      line: 6,
      column: 1
    },
    {
      code: "a {}\r\n\r\n/** horse */\r\n\r\n\r\n\r\nb {}",
      message: messages.expected(2),
      line: 6,
      column: 1
    },
    {
      code: "/* horse\n\n\n\n */\na {}",
      message: messages.expected(2),
      line: 4,
      column: 1
    },
    {
      code: "/* horse\r\n\r\n\r\n\r\n */\r\na {}",
      message: messages.expected(2),
      line: 4,
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
      code: "\n\n// one"
    },
    {
      code: "// one\n\n"
    },
    {
      code: "// one\n\n\n// two\n"
    }
  ],

  reject: [
    {
      code: "\n\n\n// one",
      message: messages.expected(2),
      line: 3,
      column: 1
    },
    {
      code: "// one\n\n\n",
      message: messages.expected(2),
      line: 4,
      column: 1
    },
    {
      code: "// one\n\n\n\n// two\n",
      message: messages.expected(2),
      line: 4,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [2, { ignore: "comments" }],

  accept: [
    {
      code: "a {}\n\n/*\n\n\n\n*/\n\nb {}"
    },
    {
      code: "a {}\r\n\r\n/*\r\n\r\n\r\n\r\n*/\r\n\r\nb {}"
    },
    {
      code: "a {}\n\n/**\n\n\n\n\n\n\n*/\n\nb {}"
    },
    {
      code: "a {}\r\n\r\n/**\r\n\r\n\r\n\r\n\r\n\r\n\r\n*/\r\n\r\nb {}"
    },
    {
      code: "a {\n display: block;\n /*\n\n\n\n */\n}\n\n"
    },
    {
      code: "a {\r\n display: block;\r\n /*\r\n\r\n\r\n\r\n */\r\n}\r\n\r\n"
    }
  ],

  reject: [
    {
      code: "a {}\n\n/*\n\n\n\n\n*/\n\n\n\nb {}",
      message: messages.expected(2),
      line: 11,
      column: 1
    },
    {
      code: "a {}\r\n\r\n/**\r\n\r\n\r\n\r\n\r\n*/\r\n\r\n\r\n\r\nb {}",
      message: messages.expected(2),
      line: 11,
      column: 1
    }
  ]
});
