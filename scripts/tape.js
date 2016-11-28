#!/usr/bin/env node
"use strict"
/* eslint-disable no-console */

const queue = require("d3-queue").queue
const path = require("path")
const globby = require("globby")
const child_process = require("child_process")

const q = queue(10)

globby(path.join(__dirname, "../lib/rules/**/__tests__/*.js")).then((paths) => {
  const chunkSize = Math.ceil(paths.length / 20)
  const chunkCount = Math.ceil(paths.length / chunkSize)
  let exitCode = 0
  for (let i = 0; i < chunkCount; i++) {
    const chunkPaths = paths.slice(i * chunkSize, (i + 1) * chunkSize)
    q.defer((done) => {
      let tap = ""
      const chunkTests = child_process.spawn(path.join(__dirname, "../node_modules/.bin/tape"), chunkPaths)
      chunkTests.on("error", done)
      chunkTests.stdout.on("data", (data) => tap += data.toString())
      chunkTests.on("close", (code) => {
        if (code !== 0) exitCode = code
        console.log(tap)
        done()
      })
    })
  }
  q.awaitAll((err) => {
    if (err) return console.error(err.stack)
    process.exit(exitCode)
  })
})
