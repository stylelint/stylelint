import test from "tape"
import cssFunctionArguments from "../cssFunctionArguments"

test("passes function arguments to callback", t => {
  cssFunctionArguments("calc(1 + 3)", "calc", (expression, expressionIndex) => {
    t.equal(expression, "1 + 3")
    t.equal(expressionIndex, 5)
  })
  cssFunctionArguments("4px 5px calc(1px + 3px)", "calc", (expression, expressionIndex) => {
    t.equal(expression, "1px + 3px")
    t.equal(expressionIndex, 13)
  })
  t.end()
})

test("works with nested functions", t => {
  const calcExpressions = []
  const calcExpressionIndexes = []
  cssFunctionArguments("4px 5px calc(calc(1px + 2px) + 3px)", "calc", (expression, expressionIndex) => {
    calcExpressions.push(expression)
    calcExpressionIndexes.push(expressionIndex)
  })
  t.deepEqual(calcExpressions, [ "calc(1px + 2px) + 3px", "1px + 2px" ])
  t.deepEqual(calcExpressionIndexes, [ 13, 18 ])

  const colorFuncValue = "color(red s(- 10%) s( - 10%))"
  cssFunctionArguments(colorFuncValue, "color", (expression, expressionIndex) => {
    t.equal(expression, "red s(- 10%) s( - 10%)")
    t.equal(expressionIndex, 6)
  })
  const sExpressions = []
  const sExpressionIndexes = []
  cssFunctionArguments(colorFuncValue, "s", (expression, expressionIndex) => {
    sExpressions.push(expression)
    sExpressionIndexes.push(expressionIndex)
  })
  t.deepEqual(sExpressions, [ "- 10%", " - 10%" ])
  t.deepEqual(sExpressionIndexes, [ 12, 21 ])
  t.end()
})

test("ignores strings", t => {
  cssFunctionArguments("calc(1px)", "calc", (expression, expressionIndex) => {
    t.equal(expression, "1px")
    t.equal(expressionIndex, 5)
  })
  cssFunctionArguments("\"calc(1px)\"", "calc", (expression, expressionIndex) => {
    t.equal(expression, null)
    t.equal(expressionIndex, null)
  })
  t.end()
})
