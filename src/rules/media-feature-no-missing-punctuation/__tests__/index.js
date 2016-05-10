import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "@nonsense (min-width max-width no-width) {}",
  }, {
    code: "@import 'foo.css';",
  }, {
    code: "@if {} @else {}",
  }, {
    code: "@media (min-width: 300px) {}",
  }, {
    code: "@mEdIa (min-width: 300px) {}",
  }, {
    code: "@MEDIA (min-width: 300px) {}",
  }, {
    code: "@media ( min-width: 300px ) {}",
  }, {
    code: "@media (min-width   :\t300px) {}",
  }, {
    code: "@media ( min-width   :\t300px ) {}",
  }, {
    code: "@media (width > 20em) {}",
  }, {
    code: "@media (width> 20em) {}",
  }, {
    code: "@media (width >20em) {}",
  }, {
    code: "@media (width>20em) {}",
  }, {
    code: "@media (10px <= width < 20em) {}",
  }, {
    code: "@media (10px<= width < 20em) {}",
  }, {
    code: "@media (10px<= width <20em) {}",
  }, {
    code: "@media only screen and (min-width: 300px) and (max-width: 600px) {}",
  }, {
    code: "@media only screen and ( min-width: 300px ) and ( max-width: 600px ) {}",
  }, {
    code: "@media (color) {}",
  } ],

  reject: [ {
    code: "@media (min-width 300px) {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "@mEdIa (min-width 300px) {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "@MEDIA (min-width 300px) {}",
    message: messages.rejected,
    line: 1,
    column: 8,
  }, {
    code: "@media (min-width   \t300px)",
    message: messages.rejected,
  }, {
    code: "@media (10px width <= 20em)",
    message: messages.rejected,
  }, {
    code: "@media (10px <= width 20em  )",
    message: messages.rejected,
  }, {
    code: "@media only screen\n  and (min-width: 300px)\n  and (max-width 600px) {}",
    message: messages.rejected,
    line: 3,
    column: 7,
  }, {
    code: "@media (color),\n  (min-width: 300px)\n  and (max-width 600px) {}",
    message: messages.rejected,
    line: 3,
    column: 7,
  } ],
})
