import standalone from "../standalone"
import test from "tape"

test("standalone with input css and quiet mode", t => {
  let planned = 0
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": [ true, { "severity": "warning" } ],
    },
  }

  standalone({ code: "a {}", config }).then(({ results }) => {
    t.deepEqual(results[0].warnings, [])
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
