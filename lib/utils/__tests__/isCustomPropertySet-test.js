"use strict"

const isCustomPropertySet = require("../isCustomPropertySet")
const postcss = require("postcss")
const test = require("tape")

test("customPropertySet", t => {
  t.plan(2)

  customPropertySet("--foo: {};", customPropertySet => {
    t.ok(isCustomPropertySet(customPropertySet), "empty custom property set")
  })

  customPropertySet("--foo: red;", customPropertySet => {
    t.notOk(isCustomPropertySet(customPropertySet), "custom var")
  })
})

function customPropertySet(css, cb) {
  postcss().process(css).then(result => {
    result.root.walk(cb)
  }).catch(error => {
    console.log(error) // eslint-disable-line no-console
  })
}
