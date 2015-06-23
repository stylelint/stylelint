export default function (options, exceptionName) {
  return options && options.except && options.except.indexOf(exceptionName) !== -1
}
