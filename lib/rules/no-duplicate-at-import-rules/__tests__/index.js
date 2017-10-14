"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: '@import "mystyle.css";'
    },
    {
      code: '@import url("mystyle.css");'
    },
    {
      code: '@import url("mystyle.css") projection, tv;'
    },
    {
      code: '@import "mystyle.css"; @import "otherstyle.css";'
    }
  ],

  reject: [
    {
      code: '@import "mystyle.css"; @import "mystyle.css";',
      message: messages.rejected(`"mystyle.css"`)
    },
    {
      code: '@import url("mystyle.css"); @import url("mystyle.css");',
      message: messages.rejected(`url("mystyle.css")`)
    },
    {
      code:
        '@import url("mystyle.css"); @import url("otherstyle.css"); @import url("mystyle.css");',
      message: messages.rejected(`url("mystyle.css")`)
    },
    {
      code:
        '@import url("mystyle.css"); a { color: red }; @import url("mystyle.css");',
      message: messages.rejected(`url("mystyle.css")`)
    }
  ]
});
