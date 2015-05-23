export default function (str) {
  if (str[0] !== "-") {
    return str
  }

  // Return the string after the second hyphen,
  // which is where the prefix ends
  return str.slice(str.slice(1).indexOf("-") + 2)
}
