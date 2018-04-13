"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["tab"],
  syntax: "html",
  fix: true,

  accept: [
    {
      code: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`
    },
    {
      code: `
<style>
a {
\tdisplay:block;
}
</style>`
    }
  ],

  reject: [
    {
      code: `
<style>
\ta {
\tdisplay:block;
\t}
</style>`,
      fixed: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      message: messages.expected("2 tabs"),
      line: 4,
      column: 2
    },
    {
      code: `
<style>
a {
display:block;
}
</style>`,
      fixed: `
<style>
a {
\tdisplay:block;
}
</style>`,
      message: messages.expected("1 tab"),
      line: 4,
      column: 1
    },
    {
      code: `
<style>
  a {
  display:block;
  }
</style>`,
      fixed: `
<style>
\ta {
\t\tdisplay:block;
\t}
</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 3
    },
    {
      code: `
\t<style>
\t a {
\t display:block;
\t }
\t</style>
\t<style>
\t b {
\t display:block;
\t }
\t</style>`,
      fixed: `
\t<style>
\ta {
\t\tdisplay:block;
\t}
\t</style>
\t<style>
\tb {
\t\tdisplay:block;
\t}
\t</style>`,
      message: messages.expected("1 tab"),
      line: 3,
      column: 3
    }
  ]
});
