export default function (atRule) {
  let indexOffset = 1 + atRule.name.length
  if (atRule.raw("afterName")) {
    indexOffset += atRule.raw("afterName").length
  }
  return indexOffset
}
