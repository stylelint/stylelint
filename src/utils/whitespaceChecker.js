import isWhitespace from "./isWhitespace"

export default function (whitespace, expectation, messages) {

  function before(source, index, err, oneCharOnly=false) {
    switch (expectation) {
      case "always":
        expectBefore(source, index, err, oneCharOnly)
        break
      case "never":
        rejectBefore(source, index, err)
        break
      default:
        throw new Error(`Unknown expectation "${expectation}"`)
    }
  }

  function after(source, index, err, oneCharOnly=false) {
    switch (expectation) {
      case "always":
        expectAfter(source, index, err, oneCharOnly)
        break
      case "never":
        rejectAfter(source, index, err)
        break
      default:
        throw new Error(`Unknown expectation "${expectation}"`)
    }
  }

  function afterOneOnly(source, index, err) {
    after(source, index, err, true)
  }

  function expectBefore(source, index, err, oneCharOnly) {
    const oneCharBefore = source[index - 1]
    const twoCharsBefore = source[index - 2]

    if ((isValue(oneCharBefore) && oneCharBefore !== whitespace)
      || (!oneCharOnly && isValue(twoCharsBefore) && isWhitespace(twoCharsBefore))) {
      err(messages.expectedBefore(source[index]))
    }
  }

  function rejectBefore(source, index, err) {
    const oneCharBefore = source[index - 1]

    if (isValue(oneCharBefore) && isWhitespace(oneCharBefore)) {
      err(messages.rejectedBefore(source[index]))
    }
  }

  function expectAfter(source, index, err, oneCharOnly) {
    const oneCharAfter = source[index + 1]
    const twoCharsAfter = source[index + 2]

    if ((isValue(oneCharAfter) && oneCharAfter !== whitespace)
      || (!oneCharOnly && isValue(twoCharsAfter) && isWhitespace(twoCharsAfter))) {
      err(messages.expectedAfter(source[index]))
    }
  }

  function rejectAfter(source, index, err) {
    const oneCharAfter = source[index + 1]

    if (isValue(oneCharAfter) && isWhitespace(oneCharAfter)) {
      err(messages.rejectedAfter(source[index]))
    }
  }

  return {
    before,
    after,
    afterOneOnly,
  }
}

function isValue(x) {
  return x !== undefined && x !== null
}
