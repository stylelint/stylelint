import test from "tape"
import findFontFamily from "../findFontFamily"

test("findFontFamily", t => {
  t.deepEqual(findFontFamily("12pt/10pt sans-serif"), [{ name: "sans-serif", index: 1 }])
  t.deepEqual(findFontFamily("bold italic 110% serif"), [{ name: "serif", index: 3 }])
  t.deepEqual(findFontFamily("normal small-caps 12px/14px fantasy"), [{ name: "fantasy", index: 3 }])
  t.deepEqual(
    findFontFamily("italic bold 12px/30px Georgia, serif"),
    [
      { name: "Georgia", index: 3 },
      { name: "serif", index: 4 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px/30px Lucida Grande, Arial, sans-serif"),
    [
      { name: "Lucida Grande", index: 3 },
      { name: "Arial", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px/ 30px Lucida Grande, Arial, sans-serif"),
    [
      { name: "Lucida Grande", index: 3 },
      { name: "Arial", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px /30px Lucida Grande, Arial, sans-serif"),
    [
      { name: "Lucida Grande", index: 3 },
      { name: "Arial", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px/30px Lucida Grande, Arial, sans-serif"),
    [
      { name: "Lucida Grande", index: 3 },
      { name: "Arial", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px/30px \"Red/Black\", Arial, sans-serif"),
    [
      { name: "\"Red/Black\"", index: 3 },
      { name: "Arial", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px/30px Arial, \"Ahem!\", sans-serif"),
    [
      { name: "Arial", index: 3 },
      { name: "\"Ahem!\"", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.deepEqual(
    findFontFamily("italic bold 12px/30px \"Hawaii 5-0\", Arial, sans-serif"),
    [
      { name: "\"Hawaii 5-0\"", index: 3 },
      { name: "Arial", index: 4 },
      { name: "sans-serif", index: 5 },
    ]
  )

  t.end()
})
