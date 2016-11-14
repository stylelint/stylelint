import path from "path"
import standalone from "../standalone"

it("standalone loading YAML with custom message", () => {
  return standalone({
    code: "a { color: pink; }",
    configFile: path.join(__dirname, "fixtures/config-color-named-custom-message.yaml"),
  }).then(({ results }) => {
    expect(results[0].warnings.length).toBe(1)
    expect(results[0].warnings[0].text).toBe("Unacceptable")
  })
})
