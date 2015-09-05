export default function (str, blurChar="`") {
  return str.replace(/\/\*.*\*\//g, blurChar)
}
