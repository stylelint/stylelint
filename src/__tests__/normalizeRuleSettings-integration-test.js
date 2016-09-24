import standalone from "../standalone"
import test from "tape"

test("[normalized rule settings] primary options array", t => {
  standalone({
    code: "a:focus {}",
    config: {
      rules: {
        "selector-pseudo-class-blacklist": ["focus"],
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings[0].rule, "selector-pseudo-class-blacklist")
    t.end()
  }).catch(t.end)
})

test("[normalized rule settings] primary options array in array", t => {
  standalone({
    code: "a:focus {}",
    config: {
      rules: {
        "selector-pseudo-class-blacklist": [["focus"]],
      },
    },
  }).then(({ results }) => {
    t.equal(results[0].warnings[0].rule, "selector-pseudo-class-blacklist")
    t.end()
  }).catch(t.end)
})
