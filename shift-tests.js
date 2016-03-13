import _ from "lodash"

const toSourceOptions = {
  trailingComma: true,
  tabWidth: 2,
}

export default function (fileInfo, api) {
  const j = api.jscodeshift
  const source = fileInfo.source
  const result = j.program([])

  j(source).find(j.CallExpression).forEach(path => {
    const node = path.node

    if (!_.includes([ "testRule", "testRuleScss" ], node.callee.name)) { return }

    const usesScss = node.callee.name === "testRuleScss"

    const testFuncNode = node.arguments.slice(-1)
    const configNodes = j.arrayExpression(node.arguments.slice(0, -1))

    const positiveTests = j.arrayExpression([])
    const negativeTests = j.arrayExpression([])

    let usesWarningFreeBasics = false
    j(testFuncNode).find(j.CallExpression).forEach(path => {
      const node = path.node

      if (!usesWarningFreeBasics && node.callee.name === "warningFreeBasics") {
        usesWarningFreeBasics = true
        return
      }

      if (_.get(node, "callee.object.name") !== "tr") { return }
      if (!_.get(node, "callee.property.name")) { return }

      const testCase = j.objectExpression([])

      testCase.properties.push(j.property("init",
        j.identifier("code"),
        node.arguments[0]
      ))

      if (node.callee.property.name === "ok") {
        addPositiveTestCase(testCase, node, positiveTests)
        return
      }

      if (node.callee.property.name === "notOk") {
        addNegativeTestCase(testCase, node, negativeTests)
        return
      }
    })

    const testGroupDescription = j.objectExpression([])
    testGroupDescription.properties.push(j.property("init",
      j.identifier("ruleName"),
      j.identifier("ruleName")
    ))
    testGroupDescription.properties.push(j.property("init",
      j.identifier("config"),
      configNodes
    ))
    if (!usesWarningFreeBasics) {
      testGroupDescription.properties.push(j.property("init",
        j.identifier("skipBasicChecks"),
        j.literal(true)
      ))
    }
    if (usesScss) {
      testGroupDescription.properties.push(j.property("init",
        j.identifier("syntax"),
        j.literal("scss")
      ))
    }
    if (positiveTests.elements.length) {
      testGroupDescription.properties.push(j.property("init",
        j.identifier("accept"),
        positiveTests
      ))
    }
    if (negativeTests.elements.length) {
      testGroupDescription.properties.push(j.property("init",
        j.identifier("reject"),
        negativeTests
      ))
    }

    var testGroup = j.expressionStatement(j.callExpression(
      j.identifier("testRule"),
      [ j.identifier("rule"), testGroupDescription ]
    ))

    result.body.push(testGroup)
  })

  let newFileContents = "/* eslint-disable comma-dangle,array-bracket-spacing */\n"
  newFileContents += "import testRule from \"../../../testUtils/blueTapeStylelintAssert\"\n"
  newFileContents += "import rule, { ruleName, messages } from \"..\"\n\n"
  newFileContents += j(result).toSource(toSourceOptions)

  let newFileContentsStylized = newFileContents.replace(/}\);/g, "})")

  return newFileContentsStylized

  function addPositiveTestCase(testCaseNode, expressionNode, positiveTestsNode) {
    if (expressionNode.arguments[1]) {
      testCaseNode.properties.push(j.property("init",
        j.identifier("description"),
        expressionNode.arguments[1]
      ))
    }
    positiveTestsNode.elements.push(testCaseNode)
    return
  }

  function addNegativeTestCase(testCaseNode, expressionNode, negativeTestsNode) {
    if (expressionNode.arguments[2]) {
      testCaseNode.properties.push(j.property("init",
        j.identifier("description"),
        expressionNode.arguments[2]
      ))
    }
    if (expressionNode.arguments[1].type !== "ObjectExpression") {
      testCaseNode.properties.push(j.property("init",
        j.identifier("message"),
        expressionNode.arguments[1]
      ))
    } else {
      expressionNode.arguments[1].properties.forEach(property => {
        testCaseNode.properties.push(property)
      })
    }
    negativeTestsNode.elements.push(testCaseNode)
  }
}
