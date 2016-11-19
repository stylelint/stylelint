import declarationValueIndex from "../declarationValueIndex"
import postcss from "postcss"

it("declarationValueIndex", () => {
  t.plan(5)

  rules("a { a: b }", decl => {
    expect(declarationValueIndex(decl)).toBe(3)
  })
  rules("a { a :b }", decl => {
    expect(declarationValueIndex(decl)).toBe(3)
  })
  rules("a { a:b }", decl => {
    expect(declarationValueIndex(decl)).toBe(2)
  })
  rules("a { a  : b }", decl => {
    expect(declarationValueIndex(decl)).toBe(5)
  })
  rules("a { a:\nb }", decl => {
    expect(declarationValueIndex(decl)).toBe(3)
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(cb)
  })
}
