/* eslint-disable indent, no-multiple-empty-lines */

import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName } from ".."

const testRule = ruleTester(rule, ruleName)

// 2 spaces
testRule(2, tr => {

tr.ok(
`.foo {
  color: rgb(0, 0, 0);
}`
)

tr.ok(
`.foo {
  color: rgb(
    0,
    0,
    0
  );
}`
)

tr.ok(
`.foo {
  color: rgb(
      0,
      0,
      0
    );
}`
)

tr.ok(
`.foo {
  color: rgb(
0,
0,
0
    );
}`
)

tr.ok(
`.foo {
  color: bar(
    rgb(
      0,
      0,
      0
    )
  );
}`
)

tr.ok(
`.foo {
  color: bar(
      rgb(
        0,
        0,
        0
      )
    );
}`
)

})
