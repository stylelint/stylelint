import chalk from "chalk"
import less from "postcss-less"
import path from "path"
import scss from "postcss-scss"
import standalone from "../standalone"
import stringFormatter from "../formatters/stringFormatter"
import sugarss from "sugarss"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with scss syntax", t => {
  const config = {
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    code: "$foo: bar; // foo;\nb {}",
    syntax: "scss",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("2:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
    t.end()
  }).catch(t.end)
})

test("standalone with sugarss syntax", t => {
  const config = {
    rules: {
      "length-zero-no-unit": true,
    },
  }

  standalone({
    config,
    code: ".one\n  color: black\n  top: 0px\n.two",
    syntax: "sugarss",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("3:9") !== -1)
    t.ok(strippedOutput.indexOf("length-zero-no-unit") !== -1)
    t.end()
  }).catch(t.end)
})

test("standalone with Less syntax", t => {
  const config = {
    rules: {
      "block-no-empty": true,
    },
  }

  standalone({
    config,
    code: "@foo: bar; // foo;\nb {}",
    syntax: "less",
    formatter: stringFormatter,
  }).then(({ output }) => {
    const strippedOutput = chalk.stripColor(output)
    t.equal(typeof output, "string")
    t.ok(strippedOutput.indexOf("2:3") !== -1)
    t.ok(strippedOutput.indexOf("block-no-empty") !== -1)
    t.end()
  }).catch(t.end)
})

test("standalone with syntax set by extension", t => {
  // First three sets of cases verify that the final test
  // should be meaningful

  t.test((st) => {
    standalone({
      files: `${fixturesPath}/extension-sensitive.*`,
      config: { rules: { "block-no-empty": true } },
      syntax: "scss",
    }).then(({ results }) => {
      st.equal(results.length, 3, "correct number of files")
      const scssResult = results.find(r => path.extname(r.source) === ".scss")
      st.equal(scssResult._postcssResult.opts.syntax, scss)
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    standalone({
      files: `${fixturesPath}/extension-sensitive.*`,
      config: { rules: { "block-no-empty": true } },
      syntax: "less",
    }).then(({ results }) => {
      st.equal(results.length, 3, "correct number of files")
      const lessResult = results.find(r => path.extname(r.source) === ".less")
      st.equal(lessResult._postcssResult.opts.syntax, less)
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    standalone({
      files: `${fixturesPath}/extension-sensitive.*`,
      config: { rules: { "block-no-empty": true } },
      syntax: "sugarss",
    }).then(({ results }) => {
      st.equal(results.length, 3, "correct number of files")
      const sssResult = results.find(r => path.extname(r.source) === ".sss")
      st.equal(sssResult._postcssResult.opts.syntax, sugarss)
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    standalone({
      files: `${fixturesPath}/extension-sensitive.*`,
      config: { rules: { "block-no-empty": true } },
    }).then(({ results }) => {
      st.equal(results.length, 3, "correct number of files")
      const sssResult = results.find(r => path.extname(r.source) === ".sss")
      const lessResult = results.find(r => path.extname(r.source) === ".less")
      const scssResult = results.find(r => path.extname(r.source) === ".scss")
      st.equal(sssResult._postcssResult.opts.syntax, sugarss, ".sss causes sugarss syntax")
      st.equal(lessResult._postcssResult.opts.syntax, less, ".less causes Less syntax")
      st.equal(scssResult._postcssResult.opts.syntax, scss, ".scss causes SCSS syntax")
      st.end()
    }).catch(st.end)
  })

  t.end()
})
