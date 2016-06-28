import path from "path"
import standalone from "../standalone"
import test from "tape"

test("standalone loading YAML with custom message", t => {
  standalone({
    code: "a { color: pink; }",
    configFile: path.join(__dirname, "fixtures/config-color-named-custom-message.yaml"),
  }).then(({ results }) => {
    t.equal(results[0].warnings.length, 1)
    t.equal(results[0].warnings[0].text, "Unacceptable")
  }).catch(logError)

  t.plan(2)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line no-console
