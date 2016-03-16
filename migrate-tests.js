/* eslint-disable */
var execSync = require("child_process").execSync
var path = require("path")
var globby = require("globby")
var _ = require("lodash")

var glob = process.argv[2];

if (!glob) {
  throw new Error("No glob provided")
}

globby(path.join(__dirname, glob)).then(function(filepaths) {
  var allInfo = []
  var promiseQueue = []

  filepaths.forEach(function(filepath) {
    var friendlyFilepath = path.relative(path.join(__dirname, "src/rules"), filepath)
    console.log("processing " + friendlyFilepath)
    var fileData = { file: friendlyFilepath }

    var filePromise = Promise.resolve(filepath)
      // .then(() => testFile(filepath, fileData))
      .then(codeshiftFile)
      // .then(() => testFile(filepath, fileData))
      .then(function() {
        allInfo.push(fileData)
      })
      .catch(function(err) { console.log(err.stack) })
    promiseQueue.push(filePromise)

    function testFile(filepath, data) {
      return new Promise(function(resolve, reject) {
        var stdout = execSync(path.join(__dirname, "node_modules/.bin/babel-tape-runner " + filepath), { encoding: "utf8" })
        var testCount = _.get(stdout.match(/^# tests\s+(\d+)/m), '[0]')
        if (!testCount) {
          console.log("TESTS FAILED FOR " + friendlyFilepath)
        }
        if (data.originalTestCount) {
          data.shiftedTestCount = testCount
        } else {
          data.originalTestCount = testCount
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
