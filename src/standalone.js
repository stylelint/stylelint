import lintStream from "./lintStream"
import standardFormatter from "postcss-reporter/lib/formatter"

export default function ({ files, config, formatter } = {}) {
  const res = new Promise((resolve, reject) => {
    const chosenFormatter = formatter || standardFormatter({
      noIcon: true,
      noPlugin: true,
    })

    const linter = lintStream({ files, config })
    const stream = (files) ? linter : process.stdin.pipe(linter)

    const results = []
    let output = ""
    let errored = false

    stream.on("error", err => { reject(err) })
      .on("data", result => {
        const source = (!result.root.source)
          ? undefined
          : result.root.source.input.file || result.root.source.input.id
        output += chosenFormatter({
          source,
          messages: result.messages,
        })
        if (result.stylelintError) { errored = true }
        results.push(result)
      })
      .on("end", () => {
        resolve({ output, results, errored })
      })
  })
  return res
}
