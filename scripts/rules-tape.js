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

const ruleNames = process.argv.slice(2)
const fileGlobs = (ruleNames.length > 0)
  ? ruleNames.map((ruleName) => path.join(__dirname, `../lib/rules/${ruleName}/__tests__/*.js`))
  : path.join(__dirname, "../lib/rules/**/__tests__/*.js")

// These numbers were arrived at by guess-and-check,
// seeing which combo seemed to produce the fastest
// results
const CHUNK_SIZE = 5
const CHUNK_CONCURRENCY = 10

const q = queue(CHUNK_CONCURRENCY)

cliCursor.hide()
console.log(chalk.bold.dim("Testing ...\n"))

globby(fileGlobs).then((paths) => {
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

  const chunkCount = Math.ceil(paths.length / CHUNK_SIZE)

  for (let i = 0; i < chunkCount; i++) {
    const chunkPaths = paths.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)

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
      console.error(err)
      process.exit(1)
    })

    q.defer((done) => {
      const tapeProcess = child_process.spawn("tape", chunkPaths, { shell: true })
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
    if (!process.env.CI) {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
    }
    console.log(chalk.green(`ok: ${totalPasses}`))
    console.log(chalk.red(`not ok: ${totalFails}`))
    console.log(chalk.bold(`total: ${totalTests}`))

    if (fails.length > 0) {
      console.log(chalk.red.underline("\nfailures"))
      fails.forEach((fail) => {
        console.log(`\n${fail.comment}`)
        console.log(`  ${fail.assertion.name}`)
        console.log(chalk.green(`  expected: ${fail.assertion.error.expected}`))
        console.log(chalk.red(`  actual: ${fail.assertion.error.actual}`))
      })
    }

    process.exit(exitCode)
  })
})
