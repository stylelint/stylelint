/* eslint-disable */
var execSync = require("child_process").execSync
var path = require("path")
var globby = require("globby")

var ruleName = process.argv[2];

if (!ruleName) {
  throw new Error("No rule name provided")
}

globby(path.join(__dirname, "src/rules", ruleName, "__tests__/*.js")).then(function(filepaths) {
  var allInfo = []
  var promiseQueue = []

  filepaths.forEach(function(filepath) {
    var friendlyFilepath = path.relative(path.join(__dirname, "src/rules"), filepath)
    console.log("processing " + friendlyFilepath)
    var fileProcessingInfo = { file: friendlyFilepath }

    var filePromise = testFile(filepath)
      .then(codeshiftFile)
      .then(testFile)
      .then(function() {
        allInfo.push(fileProcessingInfo)
      })
      .catch(function(err) { console.log(err.stack) })
    promiseQueue.push(filePromise)

    function testFile(filepath) {
      return new Promise(function(resolve, reject) {
        var stdout = execSync(path.join(__dirname, "node_modules/.bin/babel-tape-runner " + filepath), { encoding: "utf8" })
        var testCount = _.get(stdout.match(/^# tests\s+(\d+)/m), '[0]')
        if (!testCount) {
          console.log("TESTS FAILED FOR " + friendlyFilepath)
        }
        if (fileProcessingInfo.originalTestCount) {
          fileProcessingInfo.shiftedTestCount = testCount
        } else {
          fileProcessingInfo.originalTestCount = testCount
        }
        resolve(filepath)
      })
    }

    function codeshiftFile(filepath) {
      return new Promise(function(resolve, reject) {
        var codeshiftPath = path.join(__dirname, "node_modules/.bin/jscodeshift")
        var transformPath = path.join(__dirname, "shift-tests.js")
        execSync(codeshiftPath + " -t " + transformPath + " " + filepath, { encoding: "utf8" })
        resolve(filepath)
      })
    }
  })

  Promise.all(promiseQueue).then(function() {
    allInfo.forEach(function(info) {
      console.log("-----------------------------")
      console.log(`file: ${info.file}`)
      console.log(`original test count: ${info.originalTestCount}`)
      console.log(`shifted test count: ${info.shiftedTestCount}`)
    })
  })
})
