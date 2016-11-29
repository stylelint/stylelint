#!/usr/bin/env node
"use strict"
/* eslint-disable no-console */

const queue = require("d3-queue").queue
const path = require("path")
const chalk = require("chalk")
const globby = require("globby")
const child_process = require("child_process")
const tapParser = require("tap-out")
const cliCursor = require("cli-cursor")

// These numbers were arrived at by guess-and-check,
// seeing which combo seemed to produce the fastest
// results
const CHUNK_COUNT = 20
const q = queue(10)

cliCursor.hide()
console.log(chalk.bold.dim("Testing ...\n"))

globby(path.join(__dirname, "../lib/rules/**/__tests__/*.js")).then((paths) => {
  const chunkSize = Math.ceil(paths.length / CHUNK_COUNT)
  let exitCode = 0

  let totalTests = 0
  let totalPasses = 0
  let totalFails = 0
  const fails = []

  let dots
  let dotPlace = 0
  const updateDots = () => {
    dotPlace = (dotPlace + 1 > 4) ? 0 : dotPlace + 1
    if (dotPlace === 4) dots = chalk.cyan("....")
    if (dotPlace === 3) dots = chalk.cyan("...") + chalk.dim(".")
    if (dotPlace === 2) dots = chalk.cyan("..") + chalk.dim("..")
    if (dotPlace === 1) dots = chalk.cyan(".") + chalk.dim("...")
    if (dotPlace === 0) dots = chalk.dim("....")
    dots = chalk.cyan(dots)
  }
  updateDots()
  const dotInterval = setInterval(updateDots, 300)

  for (let i = 0; i < CHUNK_COUNT; i++) {
    const chunkPaths = paths.slice(i * chunkSize, (i + 1) * chunkSize)

    const parser = tapParser()
    const comments = {}
    const failures = []
    parser.on("assert", (assertion) => {
      totalTests += 1
      if (!process.env.CI) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`${dots} ${totalTests}`)
      }
      if (assertion.ok) {
        totalPasses += 1
      } else {
        totalFails += 1
      }
    })
    parser.on("comment", (comment) => {
      if (comments[comment.test]) {
        comments[comment.test] += `\n${comment.raw}`
      } else {
        comments[comment.test] = comment.raw
      }
    })
    parser.on("fail", (failure) => {
      failures.push(failure)
    })
    parser.on("error", (err) => {
      throw err
    })

    q.defer((done) => {
      const tapeProcess = child_process.spawn("tape", chunkPaths)
      tapeProcess.on("error", done)
      tapeProcess.stdout.pipe(parser)
      tapeProcess.on("close", (code) => {
        failures.forEach((failure) => {
          fails.push({
            assertion: failure,
            comment: comments[failure.test],
          })
        })
        if (code !== 0) exitCode = code
        done()
      })
    })
  }
  q.awaitAll((err) => {
    clearInterval(dotInterval)
    if (err) return console.error(err.stack)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    console.log(chalk.green(`ok: ${totalPasses}`))
    console.log(chalk.red(`not ok: ${totalFails}`))
    console.log(chalk.bold(`total: ${totalTests}`))

    if (fails.length > 0) {
      console.log(chalk.red.underline("\nfailures"))
      fails.forEach((fail) => {
        console.log(`\n${fail.comment}\n`)
        console.log(chalk.bold(`  ${fail.assertion.name}`))
        console.log(chalk.green(`  expected: ${fail.assertion.error.expected}`))
        console.log(chalk.red(`  actual: ${fail.assertion.error.actual}`))
      })
    }

    process.exit(exitCode)
  })
})
