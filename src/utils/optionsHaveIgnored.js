export default function (options, ignoredName) {
  return options && options.ignore && options.ignore.indexOf(ignoredName) !== -1
}
