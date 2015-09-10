import test from "tape"
import path from "path"
import fs from "fs"
import lintStream from "../lintStream"

const fixuresPath = path.join(__dirname, "fixtures")
const noEmptyBlockConfig = {
  rules: {
    "block-no-empty": 2,
  },
}

test("lintStream with files glob", t => {
  let planned = 0

  lintStream({ files: `${fixuresPath}/empty-block.css`, config: noEmptyBlockConfig })
    .on("data", result => {
      t.ok(result.warnings().length === 1)
      t.ok(result.warnings()[0].text.indexOf("block-no-empty") !== -1)
    })
    .on("end", () => {
      t.pass("stream ended")
    })
  planned += 3

  t.plan(planned)
})

test("lintStream with file stream input", t => {
  let planned = 0

  fs.createReadStream(`${fixuresPath}/empty-block.css`, { encoding: "utf8" })
    .pipe(lintStream({ config: noEmptyBlockConfig }))
    .on("data", result => {
      t.ok(result.warnings().length === 1)
      t.ok(result.warnings()[0].text.indexOf("block-no-empty") !== -1)
    })
    .on("end", () => {
      t.pass("stream ended")
    })
  planned += 3

  t.plan(planned)
})

test("lintStream with stdin input", t => {
  let planned = 0

  process.stdin
    .pipe(lintStream({ config: noEmptyBlockConfig }))
    .on("data", result => {
      t.ok(result.warnings().length === 1)
      t.ok(result.warnings()[0].text.indexOf("block-no-empty") !== -1)
    })

  process.stdin.push("a {}")
  process.stdin.emit("end")

  planned += 2

  t.plan(planned)
})
