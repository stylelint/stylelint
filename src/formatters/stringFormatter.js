import formatter from "postcss-reporter/lib/formatter"

const minimalFormatter = formatter({
  noIcon: true,
  noPlugin: true,
})

export default function (results) {
  let output = ""
  results.forEach(result => {
    output += minimalFormatter({
      messages: result.warnings,
      source: result.source,
    })
  })
  return output
}
