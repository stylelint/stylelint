import isCustomPropertySet from "../isCustomPropertySet"
import postcss from "postcss"

it("customPropertySet", () => {
  customPropertySet("--foo: {};", customPropertySet => {
    expect(isCustomPropertySet(customPropertySet)).toBeTruthy()
  })

  customPropertySet("--foo: red;", customPropertySet => {
    expect(isCustomPropertySet(customPropertySet)).toBeFalsy()
  })
})

function customPropertySet(css, cb) {
  postcss().process(css).then(result => {
    result.root.walk(cb)
  })
    .catch(error => {
      console.log(error) // eslint-disable-line no-console
    })
}
