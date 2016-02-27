// import {
//   ruleTester,
//   warningFreeBasics,
// } from "../../../testUtils"
// import rule, { ruleName, messages } from ".."
//
// const testRule = ruleTester(rule, ruleName)
//
// testRule(undefined, tr => {
//   warningFreeBasics(tr)
//
//   tr.ok("a { color: pink; }")
//   tr.ok("a { color: pink; background: orange; }")
//   tr.ok("a { color: pink; { &:hover { color: orange; } } }", "spec nested")
//   tr.ok("a { color: pink; @media { color: orange; } }", "nested")
//   tr.ok("a { color: pink; @media { color: orange; &::before { color: black; } } }", "double nested")
//   tr.ok("a { $scss: 0; $scss: $scss + 1; }")
//   tr.ok("a { @less: 0; @less: @less + 1; }")
//   tr.ok("a { --custom-property: 0; --custom-property: 1; }")
//   tr.ok("@fontface { src: url(font.eof); src: url(font.woff) }")
//
//   tr.notOk("a { color: pink; color: orange }", messages.rejected("color"))
//   tr.notOk("a { color: pink; background: orange; color: orange }", messages.rejected("color"))
//   tr.notOk("a { color: pink; background: orange; background: pink; }", messages.rejected("background"))
//   tr.notOk(
//     "a { color: pink; { &:hover { color: orange; color: black; } } }",
//     messages.rejected("color"),
//     "spec nested"
//   )
//   tr.notOk(
//     "a { color: pink; @media { color: orange; color: black; } }",
//     messages.rejected("color"),
//     "nested"
//   )
//   tr.notOk(
//     "@media { color: orange; .foo { color: black; color: white; } }",
//     messages.rejected("color"),
//     "nested"
//   )
//   tr.notOk(
//     "a { color: pink; @media { color: orange; &::before { color: black; color: white; } } }",
//     messages.rejected("color"),
//     "double nested"
//   )
//   tr.notOk(
//     "a { color: pink; @media { color: orange; .foo { color: black; color: white; } } }",
//     messages.rejected("color"),
//     "double nested again"
//   )
// })
