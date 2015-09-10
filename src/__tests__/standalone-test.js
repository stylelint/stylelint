import standalone from "../standalone"
import test from "tape"
import path from "path"

const fixuresPath = path.join(__dirname, "fixtures")
const noEmptyBlockConfig = {
  rules: {
    "block-no-empty": 2,
  },
}

test("standalone with single file", t => {
  let planned = 0

  standalone({ files: `${fixuresPath}/empty-block.css`, config: noEmptyBlockConfig })
    .then(({ output, results }) => {
      t.equal(typeof output, "string")
      t.equal(results.length, 1)
      t.ok(results[0].warnings().length === 1)
      t.ok(results[0].warnings()[0].text.indexOf("block-no-empty") !== -1)
    })
  planned += 4

  t.plan(planned)
})
