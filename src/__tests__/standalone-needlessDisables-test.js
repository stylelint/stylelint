import path from "path"
import standalone from "../standalone"
import test from "tape"

const fixturesPath = path.join(__dirname, "fixtures")

test("standalone with input css and `reportNeedlessDisables`", t => {
  let planned = 0
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": true,
      "color-named": "never",
    },
  }

  standalone({
    code: "/* stylelint-disable color-named */\na {}",
    config,
    reportNeedlessDisables: true,
  }).then(({ needlessDisables }) => {
    t.equal(typeof needlessDisables, "object")
    t.equal(needlessDisables.length, 1)
    t.equal(needlessDisables[0].ranges.length, 1)
    t.deepEqual(needlessDisables[0].ranges[0], {
      start: 1,
    })
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("standalone with input file(s) and `reportNeedlessDisables`", t => {
  let planned = 0
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": true,
      "color-named": "never",
    },
  }

  standalone({
    files: path.join(fixturesPath, "empty-block-with-disables.css"),
    config,
    reportNeedlessDisables: true,
  }).then(({ needlessDisables }) => {
    t.equal(typeof needlessDisables, "object")
    t.equal(needlessDisables.length, 1)
    t.equal(needlessDisables[0].source, path.join(fixturesPath, "empty-block-with-disables.css"))
    t.deepEqual(needlessDisables[0].ranges[0], {
      start: 1,
    })
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
