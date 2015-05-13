export default function (char) {
  return [ " ", "\n", "\t", "\r", "\f" ].indexOf(char) !== -1
}
