import path from "path"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "./fixtures")

test("processor transforms input and output", t => {
  const code = "one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree"
  standalone({
    code,
    config: {
      extends: "./config-block-no-empty",
      processors: "./processor-fenced-blocks",
    },
    configBasedir: fixturesPath,
  }).then(({ results }) => {
    t.equal(results.length, 1, "number of results")
    t.equal(results[0].warnings.length, 1, "number of warnings")
    t.equal(results[0].warnings[0].rule, "block-no-empty", "warning rule")
    t.equal(results[0].warnings[0].line, 2, "warning line")
    t.equal(results[0].warnings[0].column, 3, "warning column")
    t.equal(results[0].specialMessage, "was processed", "special message")
    t.end()
  }).catch(t.end)
})

test("processor accepts options", t => {
  const code = "one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree"
  standalone({
    code,
    config: {
      extends: "./config-block-no-empty",
      processors: [
        [ "./processor-fenced-blocks", { specialMessage: "options worked" } ],
      ],
    },
    configBasedir: fixturesPath,
  }).then(({ results }) => {
    t.equal(results[0].specialMessage, "options worked", "special message")
    t.end()
  }).catch(t.end)
})

test("multiple processors", t => {
  const code = "one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree???startc {}???end" +
    "\n\n???start```start\na {}\nb { color: pink }\n```end???end"
  standalone({
    code,
    config: {
      extends: "./config-block-no-empty",
      processors: [
        "./processor-triple-question-marks",
        [ "./processor-fenced-blocks", { specialMessage: "options worked" } ],
      ],
    },
    configBasedir: fixturesPath,
  }).then(({ results }) => {
    t.equal(results.length, 1, "number of results")
    t.equal(results[0].warnings.length, 1, "number of warnings")
    t.equal(results[0].warnings[0].rule, "block-no-empty", "warning rule")
    t.equal(results[0].warnings[0].line, 2, "warning line")
    t.equal(results[0].warnings[0].column, 3, "warning column")
    t.equal(results[0].specialMessage, "options worked", "special message")
    t.equal(results[0].tripleQuestionMarkBlocksFound, true, "tripleQuestionMarkBlocksFound")
    t.end()
  }).catch(t.end)
})

test("loading processors (and extend) from process.cwd", t => {
  const actualCwd = process.cwd()
  process.chdir(path.join(__dirname, ".."))

  const code = "one\ntwo\n```start\na {}\nb { color: pink }\n```end\nthree???startc {}???end" +
    "\n\n???start```start\na {}\nb { color: pink }\n```end???end"
  standalone({
    code,
    config: {
      extends: "./__tests__/fixtures/config-block-no-empty",
      processors: [
        "./__tests__/fixtures/processor-triple-question-marks",
        [ "./__tests__/fixtures/processor-fenced-blocks", { specialMessage: "options worked" } ],
      ],
    },
  }).then(({ results }) => {
    t.equal(results.length, 1, "number of results")
    t.equal(results[0].warnings.length, 1, "number of warnings")
    t.equal(results[0].specialMessage, "options worked", "special message")
    t.equal(results[0].tripleQuestionMarkBlocksFound, true, "tripleQuestionMarkBlocksFound")

    process.chdir(actualCwd)
    t.end()
  }).catch((err) => {
    process.chdir(actualCwd)
    t.end(err)
  })
})
