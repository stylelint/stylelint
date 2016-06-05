import _ from "lodash"

// Omit any properties starting with `_`, which are fake-private
export default function (results) {
  const cleanedResults = results.map(result => {
    return _.omitBy(result, (value, key) => key[0] === "_")
  })
  return JSON.stringify(cleanedResults)
}
