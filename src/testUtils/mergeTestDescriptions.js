import _ from "lodash"

export default function (...objs) {
  return _.mergeWith({}, ...objs, mergeCustomizer)
}

function mergeCustomizer(objValue, srcValue) {
  if (_.isArray(objValue, mergeCustomizer)) {
    return objValue.concat(srcValue)
  }
}
