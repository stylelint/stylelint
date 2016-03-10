import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(true, tr => {
  warningFreeBasics(tr)

  // These are just enough to ensure that the integration with colorguard
  // is working as expected: but that tool has its own tests

  tr.ok("a { color: #fff; } b { color: #000; }")

  // The tests below are mostly copied from colorguard

  tr.notOk("h1 {\n  color: black;\n  color: #010101;\n}", {
    message: messages.rejected("#010101", "black"),
    line: 3,
    column: 10,
  })

  tr.notOk("h1 {\n  color: rgb(0, 0, 0);\n  color: #010101;\n}", {
    message: messages.rejected("#010101", "rgb(0, 0, 0)"),
    line: 3,
    column: 10,
  })

  tr.notOk("h1 {\n  color: black;\n  color: rgb(0, 0, 0);\n}", {
    message: messages.rejected("rgb(0, 0, 0)", "black"),
    line: 3,
    column: 10,
  })

  tr.notOk(`@-webkit-keyframes spin {
    /* This comment used to break things */
    0% {
      -webkit-transform: rotate(0deg);
      color: #010101;
    }
    100% {
      -webkit-transform: rotate(360deg);
      /* It should still pick this one up */
      background: #000000;
    }
  }`, {
    message: messages.rejected("#000000", "#010101"),
    line: 10,
    column: 19,
  })
})

testRule(true, { whitelist: [[ "#000000", "#020202" ]] }, tr => {
  tr.notOk(".classname {\n  background-image: -webkit-linear-gradient(rgba(0,0,0,1), #020202);\n  color: #000000;\n}", {
    message: messages.rejected("#000000", "rgba(0,0,0,1)"),
    line: 3,
    column: 10,
  })
})

testRule(true, { ignore: ["#000000"] }, tr => {
  tr.ok("h1 {\n  color: black;\n  color: #010101;\n}")
})

testRule(true, { threshold: 0 }, tr => {
  tr.ok("h1 {\n  color: black;\n  color: #010101;\n}")
})
