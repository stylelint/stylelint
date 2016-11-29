#!/usr/bin/env node
"use strict"
/* eslint-disable no-console */

const queue = require("d3-queue").queue
const path = require("path")
const chalk = require("chalk")
const globby = require("globby")
const child_process = require("child_process")
const tapParser = require("tap-parser")

// These numbers were arrived at by guess-and-check,
// seeing which combo seemed to produce the fastest
// results
const CHUNK_COUNT = 20
const q = queue(10)

globby(path.join(__dirname, "../lib/rules/**/__tests__/*.js")).then((paths) => {
  const chunkSize = Math.ceil(paths.length / CHUNK_COUNT)
  let exitCode = 0

  let totalTests = 0
  let totalPasses = 0
  let totalFails = 0
  const fails = []

  for (let i = 0; i < CHUNK_COUNT; i++) {
    const chunkPaths = paths.slice(i * chunkSize, (i + 1) * chunkSize)

    const parser = tapParser()
    parser.on("assert", (assertion) => {
      totalTests += 1
      if (assertion.ok) {
        totalPasses += 1
      } else {
        totalFails += 1
        fails.push(assertion)
      }
    })
    parser.on("error", (err) => {
      throw err
    })

    q.defer((done) => {
      const tapeProcess = child_process.spawn("tape", chunkPaths)
      tapeProcess.on("error", done)
      tapeProcess.stdout.pipe(parser)
      tapeProcess.on("close", (code) => {
        console.log(chalk.dim(`Finished chunk ${i + 1} of ${CHUNK_COUNT}`))
        if (code !== 0) exitCode = code
        done()
      })
    })
  }
  q.awaitAll((err) => {
    if (err) return console.error(err.stack)
    console.log("\n=========\n")
    console.log(chalk.green(`ok: ${totalPasses}`))
    console.log(chalk.red(`not ok: ${totalFails}`))
    console.log(chalk.bold(`total: ${totalTests}`))

    if (fails) {
      console.log(chalk.red.underline("\nfailures\n"))
      fails.forEach((fail) => {
        console.log(`\n${JSON.stringify(fail, null, 2)}`)
      })
    }

    process.exit(exitCode)
  })
})
