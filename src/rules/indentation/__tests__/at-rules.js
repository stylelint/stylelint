/* eslint-disable indent, no-multiple-empty-lines */

import {
  ruleTester,
  warningFreeBasics
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
  message: messages.expected("0 spaces at line 2"),
  line: 2,
  column: 3,
})

tr.notOk(
`@media print {
a {
    color: pink;
  }
}`, {
  message: messages.expected("2 spaces at line 2"),
  line: 2,
  column: 1,
})

tr.notOk(
`@media print {
  a {
  color: pink;
  }
}`, {
  message: messages.expected("4 spaces at line 3"),
  line: 3,
  column: 3,
})

tr.notOk(
`@media print {
  a {
    color: pink;
}
}`, {
  message: messages.expected("2 spaces at line 4"),
  line: 4,
  column: 1,
})

tr.notOk(
`@media print {
  a {
    color: pink;
  }
\t}`, {
  message: messages.expected("0 spaces at line 5"),
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
  message: messages.expected("0 tabs at line 3"),
  line: 3,
  column: 2,
})

tr.notOk(
`@media print {

a {
color: pink;
}

}`, {
  message: messages.expected("1 tab at line 4"),
  line: 4,
  column: 1,
})

})
