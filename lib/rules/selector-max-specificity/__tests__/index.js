"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");
const stylelint = require("../../..");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["0,1,0"],

  accept: [
    {
      code: ".ab {}"
    },
    {
      code: "span a {}"
    },
    {
      code: ".a:not(.b) {}"
    },
    {
      code: ".a:not(.b, .c) {}"
    },
    {
      code: ".a:matches(.b) {}"
    },
    {
      code: ".a:matches(.b, .c) {}"
    },
    {
      code: "div div div div div div div div div div div {}",
      message:
        "a selector with 11 elements has a lower specificity than a selector with one classname"
    },
    {
      code:
        "z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z z {}",
      message:
        "a selector with 101 elements has a lower specificity than a selector with one classname"
    },
    {
      code: ":root { --foo: 1px; }",
      description: "custom property in root"
    },
    {
      code: "html { --foo: 1px; }",
      description: "custom property in selector"
    },
    {
      code: ":root { --custom-property-set: {} }",
      description: "custom property set in root"
    },
    {
      code: "html { --custom-property-set: {} }",
      description: "custom property set in selector"
    },
    {
      code: ".foo() {\n&.bar {}}"
    },
    {
      code: ".foo(@a, @b) {\n&.bar {}}"
    }
  ],

  reject: [
    {
      code: ".ab .ab {}",
      message: messages.expected(".ab .ab", "0,1,0"),
      line: 1,
      column: 1
    },
    {
      code: ".ab span {}",
      message: messages.expected(".ab span", "0,1,0"),
      line: 1,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["0,3,0"],

  accept: [
    {
      code: ".ab {}"
    },
    {
      code: ".ab .cd {}"
    },
    {
      code: ".ab .cd span {}"
    },
    {
      code: ".cd div span {}"
    },
    {
      code: ".cd .de div span a {}"
    },
    {
      code: ".cd .de div span a > b {}"
    },
    {
      code: ".cd .de, .cd .ef > b {}"
    }
  ],

  reject: [
    {
      code: "#jubjub {}",
      message: messages.expected("#jubjub", "0,3,0"),
      line: 1,
      column: 1
    },
    {
      code: ".thing div .thing .sausages {}",
      message: messages.expected(".thing div .thing .sausages", "0,3,0"),
      line: 1,
      column: 1
    },
    {
      code: ".thing div .thing, .sausages .burgers .bacon a {}",
      message: messages.expected(".sausages .burgers .bacon a", "0,3,0"),
      line: 1,
      column: 20
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["0,2,1"],

  accept: [
    {
      code: ".cd .de,\n.cd .ef > b {}"
    },
    {
      code: ".cd { .de {} }",
      description: "standard nesting"
    },
    {
      code: "div:hover { .de {} }",
      description: "element, pseudo-class, nested class"
    },
    {
      code: ".ab, .cd { & > .de {} }",
      description: "initial (unnecessary) parent selector"
    },
    {
      code: ".cd { .de > & {} }",
      description: "necessary parent selector"
    },
    {
      code: ".cd { @media print { .de {} } }",
      description: "nested rule within nested media query"
    },
    {
      code: "@media print { .cd { .de {} } }",
      description: "media query > rule > rule"
    }
  ],

  reject: [
    {
      code: ".thing div .thing,\n.sausages .burgers .bacon a {}",
      message: messages.expected(".sausages .burgers .bacon a", "0,2,1"),
      line: 2,
      column: 1
    },
    {
      code: ".cd { .de { .fg {} } }",
      message: messages.expected(".cd .de .fg", "0,2,1")
    },
    {
      code: ".cd { .de { & > .fg {} } }",
      message: messages.expected(".cd .de > .fg", "0,2,1")
    },
    {
      code: ".cd { .de { &:hover > .fg {} } }",
      message: messages.expected(".cd .de:hover > .fg", "0,2,1")
    },
    {
      code: ".cd { .de { .fg > & {} } }",
      message: messages.expected(".fg > .cd .de", "0,2,1")
    },
    {
      code: ".cd { @media print { .de { & + .fg {} } } }",
      message: messages.expected(".cd .de + .fg", "0,2,1")
    },
    {
      code: "@media print { li { & + .ab, .ef.ef { .cd {} } } }",
      message: messages.expected("li .ef.ef .cd", "0,2,1")
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["0,4,1"],

  accept: [
    {
      code: ".cd .de {& .fg {}}"
    }
  ],

  reject: [
    {
      code: ".thing .thing2 {&.nested {#pop {}}}",
      message: messages.expected(".thing .thing2.nested #pop", "0,4,1"),
      line: 1,
      column: 27
    },
    {
      code: ".thing .thing2 {#here & {}}",
      message: messages.expected("#here .thing .thing2", "0,4,1"),
      line: 1,
      column: 17
    },
    {
      code: ".thing .thing2 .thing3 .thing4 {a.here & {}}",
      message: messages.expected(
        "a.here .thing .thing2 .thing3 .thing4",
        "0,4,1"
      ),
      line: 1,
      column: 33
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["0,1,1"],
  syntax: "scss",

  accept: [
    {
      code: "#hello #{$test} {}",
      description: "ignore rules with variable interpolation"
    },
    {
      code: "@each $a in $b { .#{ map-get($a, b) } { c {} } }",
      description: "ignore nested rules with variable interpolation"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["0,1,1"],
  syntax: "less",

  accept: [
    {
      code: "#hello @{test} {}",
      description: "ignore rules with variable interpolation"
    }
  ]
});

it("cannot parse selector warning", () => {
  const config = {
    rules: {
      "selector-max-specificity": ["0,3,0"]
    }
  };

  return stylelint
    .lint({
      code: ".a:unknown(.b, .d) { }",
      config
    })
    .then(function(data) {
      const parseErrors = data.results[0].parseErrors;
      expect(parseErrors.length).toBe(1);
      expect(parseErrors[0].text).toBe("Cannot parse selector");
      expect(parseErrors[0].line).toBe(1);
      expect(parseErrors[0].column).toBe(1);
    });
});
