import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [ 2, { hierarchicalSelectors: true } ],

  accept: [ {
    code: ".foo {}\n" +
    ".foo {}",
  }, {
    code: "@media print {\n" +
    "  a {\n" +
    "    color: pink;\n" +
    "  }\n" +
    "}",
  }, {
    code: ".foo {}\n" +
    ".bar {}\n" +
    ".baz {}",
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    ".bar {}\n" +
    "  .bar-one {}",
  }, {
    code: ".foo {\n" +
    "  top: 0;\n" +
    "}\n" +
    "  .foo-one {\n" +
    "    top: 1px;\n" +
    "  }",
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    "    .foo-one-sub {}",
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    "  .foo-two {}\n" +
    "    .foo-two-sub {}\n" +
    "  .foo-three {}\n" +
    ".bar {}",
  }, {
    code: "#foo {\n" +
    "  top: 3px;\n" +
    "}\n" +
    "  #foo ul {}\n" +
    "    #foo ul > li {}\n" +
    "      #foo ul > li span {\n" +
    "        top: 4px;\n" +
    "      }\n" +
    "    #foo ul a {}\n" +
    "  #foo div {\n" +
    "    top: 6px;\n" +
    "  }\n" +
    "    #foo div span {}\n" +
    "#bar {}",
  }, {
    code: "#bar {}\n" +
    "#baz {}\n" +
    "#bar a {}\n" +
    "#baz b {}",
  }, {
    code: "@media print {\n" +
    "  .foo {\n" +
    "    top: 0;\n" +
    "  }\n" +
    "    .foo-bar {\n" +
    "      top: 10px;\n" +
    "    }\n" +
    "  .bar {\n" +
    "    top: 1px;\n" +
    "  }\n" +
    "}",
  }, {
    code: ".foo {}\n" +
    "  @media print {\n" +
    "    .foo-one {\n" +
    "      color: pink;\n" +
    "    }\n" +
    "  }",
  }, {
    code: ".foo {}\n" +
    "  @media print {\n" +
    "    .foo-one {}\n" +
    "  }",
  }, {
    code: ":root {\n" +
    "  --Grid: #fff;\n" +
    "}\n" +
    "\n" +
    ".r-Grid {\n" +
    "  color: red;\n" +
    "}\n" +
    "\n" +
    "  .r-Grid-cell {\n" +
    "    text-align: center;\n" +
    "  }",
  }, {
    code: ".foo {}\n" +
    "  /* Comment */\n" +
    "  .foo-one {}\n",
    description: "comment hierarchy",
  }, {
    code: ".foo {}\n" +
    "  /* Comment */\n",
    description: "comment hierarchy",
  } ],

  reject: [ {
    code: ".foo {}\n" +
    "  .bar {}\n" +
    ".baz {}",

    message: messages.expected("0 spaces"),
    line: 2,
    column: 3,
  }, {
    code: ".foo {}\n" +
    "    .foo-one {}\n" +
    ".bar {}\n" +
    "  .bar-one {}",

    message: messages.expected("2 spaces"),
    line: 2,
    column: 5,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    ".bar {}\n" +
    "   .bar-one {}",

    message: messages.expected("2 spaces"),
    line: 4,
    column: 4,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    ".bar {}\n" +
    "  .bar-one {\n" +
    "  top: 0;\n" +
    "  }",

    message: messages.expected("4 spaces"),
    line: 5,
    column: 3,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    "  .bar {}\n" +
    "  .bar-one {}",

    message: messages.expected("0 spaces"),
    line: 3,
    column: 3,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {\n" +
    "    color: pink;\n" +
    "     top: 0;\n" +
    "  }",

    message: messages.expected("4 spaces"),
    line: 4,
    column: 6,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    "  .foo-one-sub {}",

    message: messages.expected("4 spaces"),
    line: 3,
    column: 3,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {}\n" +
    "  .foo-two {}\n" +
    "  .foo-two-sub {}\n" +
    "  .foo-three {}\n" +
    ".bar {}",

    message: messages.expected("4 spaces"),
    line: 4,
    column: 3,
  }, {
    code: ".foo {}\n" +
    "  .foo-one {\n" +
    "    top: 0;\n" +
    "  }\n" +
    "  .foo-two {}\n" +
    "    .foo-two-sub {\n" +
    "      top: 10px;\n" +
    "    }\n" +
    "  .foo-three {}\n" +
    "  .bar {}",

    message: messages.expected("0 spaces"),
    line: 10,
    column: 3,
  }, {
    code: "#foo {}\n" +
    "  #foo ul {}\n" +
    "    #foo ul > li {}\n" +
    "      #foo ul li span {}\n" +
    "    #foo ul a {}\n" +
    "  #foo div {}\n" +
    "    #foo div span {}\n" +
    "#bar {}",

    message: messages.expected("4 spaces"),
    line: 4,
    column: 7,
  }, {
    code: "#foo {}\n" +
    "  #foo ul {}\n" +
    "    #foo ul > li {}\n" +
    "      #foo ul > li span {}\n" +
    "  #foo ul a {}\n" +
    "  #foo div {}\n" +
    "    #foo div span {}\n" +
    "#bar {}",

    message: messages.expected("4 spaces"),
    line: 5,
    column: 3,
  }, {
    code: "#bar {}\n" +
    "#baz {}\n" +
    "  #bar a {}\n" +
    "#baz b {}",

    message: messages.expected("0 spaces"),
    line: 3,
    column: 3,
  }, {
    code: "@media print {\n" +
    "  .foo {\n" +
    "    top: 0;\n" +
    "  }\n" +
    "    .foo-bar {\n" +
    "      top: 10px;\n" +
    "       bottom: 0;\n" +
    "    }\n" +
    "  .bar {\n" +
    "    top: 1px;\n" +
    "  }\n" +
    "}",

    message: messages.expected("6 spaces"),
    line: 7,
    column: 8,
  }, {
    code: ".foo {}\n" +
    "  @media print {\n" +
    "  .foo-one {\n" +
    "      color: pink;\n" +
    "    }\n" +
    "  }",

    message: messages.expected("4 spaces"),
    line: 3,
    column: 3,
  }, {
    code: ".foo {}\n" +
    "  @media print {\n" +
    "      .foo-one {}\n" +
    "  }",

    message: messages.expected("4 spaces"),
    line: 3,
    column: 7,
  } ],
})
