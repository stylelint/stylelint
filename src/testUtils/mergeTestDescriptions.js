import _ from "lodash"

export default function () {
  for (var _len = arguments.length, objs = Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key]
  }

  return _.mergeWith.apply(_, [{}].concat(objs, [mergeCustomizer]))
}

function mergeCustomizer(objValue, srcValue) {
  if (_.isArray(objValue, mergeCustomizer)) {
    return objValue.concat(srcValue)
  }
}
