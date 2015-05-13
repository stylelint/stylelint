export default function (options) {
  return {
    expectBefore: options.before === "always",
    expectAfter: options.after === "always",
    rejectBefore: options.before === "never",
    rejectAfter: options.after === "never",
    ignoreBefore: !options.before,
    ignoreAfter: !options.after,
  }
}
