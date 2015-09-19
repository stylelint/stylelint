/* eslint-disable indent, no-multiple-empty-lines */

import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

// 2 spaces
testRule(2, tr => {
warningFreeBasics(tr)

tr.ok(
`@media print {
  a {
    color: pink;
  }
}`)

tr.ok(
`@media print {
  a {
    color: pink;
  }
}

@media screen {
  b { color: orange; }
}`)

tr.notOk(
`
  @media print {
  a {
    color: pink;
  }
}`, {
  message: messages.expected("0 spaces"),
  line: 2,
  column: 3,
})

tr.notOk(
`@media print {
a {
    color: pink;
  }
}`, {
  message: messages.expected("2 spaces"),
  line: 2,
  column: 1,
})

tr.notOk(
`@media print {
  a {
  color: pink;
  }
}`, {
  message: messages.expected("4 spaces"),
  line: 3,
  column: 3,
})

tr.notOk(
`@media print {
  a {
    color: pink;
}
}`, {
  message: messages.expected("2 spaces"),
  line: 4,
  column: 1,
})

tr.notOk(
`@media print {
  a {
    color: pink;
  }
\t}`, {
  message: messages.expected("0 spaces"),
  line: 5,
  column: 2,
})

})

// tab except block
testRule("tab", { except: ["block"] }, tr => {
warningFreeBasics(tr)

tr.ok(
`@media print {

a {
\tcolor: pink;
}

}`)

tr.notOk(
`@media print {

\ta {
\tcolor: pink;
}

}`, {
  message: messages.expected("0 tabs"),
  line: 3,
  column: 2,
})

tr.notOk(
`@media print {

a {
color: pink;
}

}`, {
  message: messages.expected("1 tab"),
  line: 4,
  column: 1,
})

tr.ok(
`@media print,
\t(-webkit-min-device-pixel-ratio: 1.25),
\t(min-resolution: 120dpi) {}`)

tr.notOk(
`@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
\t(min-resolution: 120dpi) {}`, {
  message: messages.expected("1 tab"),
  line: 2,
  column: 1,
}, "multi-line at-rule params")

})

// spaces except param
testRule(4, { except: ["param"] }, tr => {
warningFreeBasics(tr)

tr.ok(
`@media print,
(-webkit-min-device-pixel-ratio: 1.25),
(min-resolution: 120dpi) {}`)

tr.notOk(
`@media print,
  (-webkit-min-device-pixel-ratio: 1.25),
(min-resolution: 120dpi) {}`, {
  message: messages.expected("0 spaces"),
  line: 2,
  column: 1,
})

})
