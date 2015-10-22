export default function (decl) {
  const charsBeforeColon = decl.toString().indexOf(":")
  const charsAfterColon = decl.raw("between").length - decl.raw("between").indexOf(":")

  return charsBeforeColon + charsAfterColon
}
