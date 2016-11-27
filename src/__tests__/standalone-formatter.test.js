import chalk from "chalk"
import configBlockNoEmpty from "./fixtures/config-block-no-empty"
import standalone from "../standalone"
import stringFormatter from "../formatters/stringFormatter"

it("standalone with input css and alternate formatter specified by keyword", () => {
  return standalone({ code: "a {}", config: configBlockNoEmpty, formatter: "string" }).then((_ref) => {
    const output = _ref.output

    const strippedOutput = chalk.stripColor(output)
    expect(typeof output).toBe("string")
    expect(strippedOutput.indexOf("1:3")).not.toBe(-1)
    expect(strippedOutput.indexOf("block-no-empty")).not.toBe(-1)
  })
})

it("standalone with input css and alternate formatter function", () => {
  return standalone({ code: "a {}", config: configBlockNoEmpty, formatter: stringFormatter }).then((_ref2) => {
    const output = _ref2.output

    const strippedOutput = chalk.stripColor(output)
    expect(typeof output).toBe("string")
    expect(strippedOutput.indexOf("1:3")).not.toBe(-1)
    expect(strippedOutput.indexOf("block-no-empty")).not.toBe(-1)
  })
})
