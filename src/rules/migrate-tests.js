/* eslint-disable */
var exec = require("child_process").exec
var path = require("path")
var globby = require("globby")

var ruleName = process.argv[2];

if (!ruleName) {
  throw new Error("No rule name provided")
}

globby(path.join(__dirname, ruleName, "__tests__/*.js")).then(function(filepaths) {
  var allInfo = []
  var promiseQueue = []

  filepaths.forEach(function(filepath) {
    var fileProcessingInfo = { file: filepath }

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
        exec(path.join(__dirname, "../../node_modules/.bin/babel-tape-runner " + filepath), function(err, stdout) {
          if (err) { return reject(err) }
          var testCount = stdout.match(/^# tests\s+(\d+)/m)[1]
          if (fileProcessingInfo.originalTestCount) {
            fileProcessingInfo.shiftedTestCount = testCount
          } else {
            fileProcessingInfo.originalTestCount = testCount
          }
          resolve(filepath)
        })
      })
    }

    function codeshiftFile(filepath) {
      return new Promise(function(resolve, reject) {
        var codeshiftPath = path.join(__dirname, "../../node_modules/.bin/jscodeshift")
        var transformPath = path.join(__dirname, "../../shift-tests.js")
        exec(codeshiftPath + " -t " + transformPath + " " + filepath, function(err, stdout) {
          if (err) { return reject(err) }
          if (stdout) { console.log(stdout) }
          resolve(filepath)
        })
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
