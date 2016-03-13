import _ from "lodash"
import fs from "fs"
import path from "path"

const toSourceOptions = {
  trailingComma: true,
  tabWidth: 2,
}

export default function (fileInfo, api) {
  const j = api.jscodeshift
  const source = fileInfo.source
  const result = j.program([])
  let abnormalInfoText = ""

  let youveBeenWarned = false
  function warn() {
    if (!youveBeenWarned) {
      /* eslint-disable no-console */
      console.log(`>> check file "${fileInfo.path}"`)
      /* eslint-disable no-console */
      youveBeenWarned = true
    }
  }

  j(source).find(j.Function).forEach(path => {
    const node = path.node
    if (!_.get(node, "id.name") || !_.get(node, "params[0].name") === "tr") { return }

    const abnormalTestGroupDescription = j.objectExpression([])
    const testCases = extractTestCases(node)

    // Log non-standard test invocations within a comment
    if (testCases.positiveTests.elements.length) {
      abnormalTestGroupDescription.properties.push(j.property("init",
        j.identifier("accept"),
        testCases.positiveTests
      ))
    }
    if (testCases.negativeTests.elements.length) {
      abnormalTestGroupDescription.properties.push(j.property("init",
        j.identifier("reject"),
        testCases.negativeTests
      ))
    }
    const groupString = j(abnormalTestGroupDescription).toSource(toSourceOptions)
    let abnormalTestGroupCode = `// Schematization of "${node.id.name}":\n`
    abnormalTestGroupCode += `const schematized${node.id.name[0].toUpperCase() + node.id.name.slice(1)} = ${groupString}`
    abnormalInfoText += "\n\n" + abnormalTestGroupCode
  })

  let usesWarningFreeBasics = false
  function extractTestCases(sourceNode) {
    const positiveTests = j.arrayExpression([])
    const negativeTests = j.arrayExpression([])
    j(sourceNode).find(j.CallExpression).forEach(path => {
      const node = path.node

      if (!usesWarningFreeBasics && node.callee.name === "warningFreeBasics") {
        usesWarningFreeBasics = true
        abnormalInfoText += "// Original file:\n" + source
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
    return {
      positiveTests,
      negativeTests,
      usesWarningFreeBasics,
    }
  }

  j(source).find(j.CallExpression).forEach(path => {
    const node = path.node

    if (!_.includes([ "testRule", "testRuleScss" ], node.callee.name)) {
      warn()
      return
    }

    const usesScss = node.callee.name === "testRuleScss"

    const testFuncNode = node.arguments.slice(-1)
    const configNodes = j.arrayExpression(node.arguments.slice(0, -1))

    const testCases = extractTestCases(testFuncNode)

    const testGroupDescription = j.objectExpression([])

    testGroupDescription.properties.push(j.property("init",
      j.identifier("ruleName"),
      j.identifier("ruleName")
    ))
    testGroupDescription.properties.push(j.property("init",
      j.identifier("config"),
      configNodes
    ))
    if (!testCases.usesWarningFreeBasics) {
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
    if (testCases.positiveTests.elements.length) {
      testGroupDescription.properties.push(j.property("init",
        j.identifier("accept"),
        testCases.positiveTests
      ))
    }
    if (testCases.negativeTests.elements.length) {
      testGroupDescription.properties.push(j.property("init",
        j.identifier("reject"),
        testCases.negativeTests
      ))
    }

    const testGroup = j.expressionStatement(j.callExpression(
      j.identifier("testRule"),
      [ j.identifier("rule"), testGroupDescription ]
    ))

    result.body.push(testGroup)
  })

  let newFileContents = "/* eslint-disable comma-dangle,array-bracket-spacing */\n"
  newFileContents += "import testRule from \"../../../testUtils/blueTapeStylelintAssert\"\n"
  newFileContents += "import rule, { ruleName, messages } from \"..\"\n\n"
  newFileContents += j(result).toSource(toSourceOptions)

  // Remove semicolons
  newFileContents = newFileContents.replace(/}\);/g, "})")

  // If we noticed that something abnormal is going on,
  // write that file for review
  if (abnormalInfoText) {
    const infoFilePath = path.join(__dirname, fileInfo.path.replace(/__tests__\/(.*?)\.js$/, "$1-codeshiftInfo.js"))
    fs.writeFileSync(infoFilePath, abnormalInfoText, "utf8")
  }

  return newFileContents

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
