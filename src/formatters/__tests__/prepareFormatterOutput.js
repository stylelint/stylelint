const _slicedToArray = function () { function sliceIterator(arr, i) { const _arr = []; let _n = true; let _d = false; let _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break } } catch (err) { _d = true; _e = err } finally { try { if (!_n && _i["return"]) _i["return"]() } finally { if (_d) throw _e } } return _arr } return function (arr, i) { if (Array.isArray(arr)) { return arr } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i) } else { throw new TypeError("Invalid attempt to destructure non-iterable instance") } } }()

const chalk = require("chalk")

const symbolConversions = new Map()
symbolConversions.set("ℹ", "i")
symbolConversions.set("✔", "√")
symbolConversions.set("⚠", "‼")
symbolConversions.set("✖", "×")

module.exports = function (results, formatter) {
  let output = chalk.stripColor(formatter(results)).trim()

  for (const _ref of symbolConversions.entries()) {
    const _ref2 = _slicedToArray(_ref, 2)

    const nix = _ref2[0]
    const win = _ref2[1]

    output = output.replace(new RegExp(nix, "g"), win)
  }

  return output
}
