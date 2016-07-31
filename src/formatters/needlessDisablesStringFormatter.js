import chalk from "chalk"
import path from "path"

function logFrom(fromValue) {
  if (fromValue.charAt(0) === "<") return fromValue
  return path.relative(process.cwd(), fromValue).split(path.sep).join("/")
}

export default function (report) {
  let output = ""

  report.forEach(sourceReport => {
    output += "\n"
    output += chalk.underline(logFrom(sourceReport.source)) + "\n"
    sourceReport.ranges.forEach(range => {
      output += `start: ${range.start}`
      if (range.end !== undefined) {
        output += `, end: ${range.end}`
      }
      output += "\n"
    })
  })

  return output
}
