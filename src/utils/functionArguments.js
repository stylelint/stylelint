import balanacdMatch from "balanced-match"
import valueIndexOf from "./valueIndexOf"

export default function (source, functionName, callback) {
  valueIndexOf({ value: source, char: functionName }, index => {
    console.log("here")
    const parensMatch = balanacdMatch("(", ")", source.substr(index))[0]
    const functionArguments = source.substr(parensMatch.start + 1, parensMatch.end)
    callback(functionArguments)
  })
}
