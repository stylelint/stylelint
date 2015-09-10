import postcss from "postcss"
import fs from "fs"
import gs from "glob-stream"
import rcLoader from "rc-loader"
import { Transform } from "stream"
import plugin from "./plugin"

export default function ({ files, config } = {}) {
  const stylelintConfig = config || rcLoader("stylelint")
  if (!stylelintConfig) {
    throw new Error("No stylelint config found")
  }

  const linter = new Transform({ objectMode: true })

  linter._transform = function (chunk, enc, callback) {
    if (files) {
      const filepath = chunk.path
      fs.readFile(filepath, "utf8", (err, css) => {
        if (err) { linter.emit("error",  err) }
        lint({ css, filepath: filepath }, callback)
      })
    } else {
      lint({ css: chunk }, callback)
    }
  }

  function lint({ css, filepath }, callback) {
    const processOptions = {}
    if (filepath) {
      processOptions.from = filepath
    }
    postcss()
      .use(plugin(stylelintConfig))
      .process(css, processOptions)
      .then(result => {
        callback(null, result)
      })
      .catch(err => {
        linter.emit("error", new Error(err))
      })
  }

  if (files) {
    const fileStream = gs.create(files)
    return fileStream.pipe(linter)
  }

  return linter
}
