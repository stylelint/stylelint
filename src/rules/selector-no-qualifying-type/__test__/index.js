import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName } from ".."

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "input { top: 0; }",
  }, {
    code: ".class { top: 0; }",
  }, {
    code: "div>.class { top: 0; }",
  }, {
    code: "div+.class { top: 0; }",
  }, {
    code: "div~.class { top: 0; }",
  }, {
    code: "#id { top: 0; }",
  }, {
    code: "div>#id { top: 0; }",
  }, {
    code: "div+#id { top: 0; }",
  }, {
    code: "div~#id { top: 0; }",
  } ],

  reject: [ {
    code: "input[type=\"button\"] { top: 0; }",
    message: "Avoid qualifying attribute selectors with an element",
  }, {
    code: "div.class { top: 0; }",
    message: "Avoid qualifying class selectors with an element",
  }, {
    code: "div#id { top: 0; }",
    message: "Avoid qualifying id selectors with an element",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: "attribute" } ],

  accept: [{
    code: "input[type=\"button\"] { top: 0; }",
  }],

  reject: [ {
    code: "div.class { top: 0; }",
    message: "Avoid qualifying class selectors with an element",
  }, {
    code: "div#id { top: 0; }",
    message: "Avoid qualifying id selectors with an element",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: "class" } ],

  accept: [{
    code: "div.class { top: 0; }",
  }],

  reject: [ {
    code: "input[type=\"button\"] { top: 0; }",
    message: "Avoid qualifying attribute selectors with an element",
  }, {
    code: "div#id { top: 0; }",
    message: "Avoid qualifying id selectors with an element",
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignore: "id" } ],

  accept: [{
    code: "div#id { top: 0; }",
  }],

  reject: [ {
    code: "input[type=\"button\"] { top: 0; }",
    message: "Avoid qualifying attribute selectors with an element",
  }, {
    code: "div.class { top: 0; }",
    message: "Avoid qualifying class selectors with an element",
  } ],
})
