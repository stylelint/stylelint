export default function (a, b) {
  const arrayA = (typeof a === "string") ? a.split(",") : a
  const arrayB = (typeof b === "string") ? b.split(",") : b
  for (let i = 0, l = arrayB.length; i < l; i++) {
    if (arrayA[i] > arrayB[i]) {
      return false
    }
    if (arrayB[i] > arrayA[i]) {
      return true
    }
  }
  return false
}
