import standalone from "../standalone"

it("standalone with input css and quiet mode", () => {
  const config = {
    quiet: true,
    rules: {
      "block-no-empty": [ true, { "severity": "warning" } ],
    },
  }

  return standalone({ code: "a {}", config }).then((_ref) => {
    const results = _ref.results

    expect(results[0].warnings).toEqual([])
  })
})
