export default function (text) {
  const err = new Error(text)
  err.code = 78
  return err
}
