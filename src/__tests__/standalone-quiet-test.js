import standalone from "../standalone"
import test from "tape"

test("standalone with input css and quiet mode", t => {
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": [ true, { "severity": "warning" } ],
    },
  }

  standalone({ code: "a {}", config }).then(({ results }) => {
    t.deepEqual(results[0].warnings, [])
    t.end()
  }).catch(t.end)
})
