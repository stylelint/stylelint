/* eslint-disable no-console */
import Benchmark from "benchmark"
import request from "request"
import postcss from "postcss"
import rules from "./src/rules"
import normalizeRuleSettings from "./src/normalizeRuleSettings"

const ruleName = process.argv[2]
const ruleOptions = process.argv[3]

console.log(`>> Rule name: ${ruleName}`)
console.log(`>> Rule options: ${ruleOptions}`)

const CSS_URL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.css"

console.log(">> Fetching CSS")
request(CSS_URL, (error, response, body) => {
  console.log(">> CSS fetched. Running benchmark ...\n")
  if (error) throw error

  const parsedOptions = (ruleOptions[0] === "[") ? JSON.parse(ruleOptions) : ruleOptions
  const rule = rules[ruleName](...normalizeRuleSettings(parsedOptions))
  const processor = postcss().use(rule)

  let firstTime = true
  const bench = new Benchmark("rule test", {
    defer: true,
    fn: deferred => {
      processor.process(body).then(result => {
        if (firstTime) {
          result.messages.filter(m => m.stylelintType === "invalidOption").forEach(m => {
            console.log(m.text)
          })
          console.log(`Warnings count: ${result.warnings().length}`)
          firstTime = false
        }
        deferred.resolve()
      }).catch(err => {
        console.log(err.stack)
        deferred.resolve()
      })
    },
  })

  bench.on("complete", () => {
    console.log(`Mean: ${bench.stats.mean}s`)
    console.log(`Elapsed: ${bench.times.elapsed}s`)
  })

  bench.run()
})
