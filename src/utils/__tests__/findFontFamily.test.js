import findFontFamily from "../findFontFamily"
import test from "tape"

test("findFontFamily", t => {
  t.deepEqual(
    findFontFamily("inherit"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "inherit",
    }]
  )
  t.deepEqual(
    findFontFamily("INHERIT"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "INHERIT",
    }]
  )
  t.deepEqual(
    findFontFamily("12pt/10pt sans-serif"),
    [{
      sourceIndex: 10,
      type: "word",
      value: "sans-serif",
    }]
  )
  t.deepEqual(
    findFontFamily("12pt/10pt Red/Black"),
    [{
      sourceIndex: 10,
      type: "word",
      value: "Red/Black",
    }]
  )
  t.deepEqual(
    findFontFamily("12pt/10pt Red/Black/Three"),
    [{
      sourceIndex: 10,
      type: "word",
      value: "Red/Black/Three",
    }]
  )
  t.deepEqual(
    findFontFamily("12pt/10pt Hawaii 5-0"),
    [{
      sourceIndex: 10,
      type: "word",
      value: "Hawaii 5-0",
    }]
  )
  t.deepEqual(
    findFontFamily("12pt/10pt Hawaii 5-0 Font"),
    [{
      sourceIndex: 10,
      type: "word",
      value: "Hawaii 5-0 Font",
    }]
  )
  t.deepEqual(
    findFontFamily("12pt/10pt /* serif */ Hawaii 5-0"),
    [{
      sourceIndex: 22,
      type: "word",
      value: "Hawaii 5-0",
    }]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px $font, serif"),
    [{
      sourceIndex: 29,
      type: "word",
      value: "serif",
    }]
  )
  t.deepEqual(
    findFontFamily("ITALIC BOLD 12PX/30PX serif"),
    [{
      sourceIndex: 22,
      type: "word",
      value: "serif",
    }]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px #{$font}, serif"),
    [{
      sourceIndex: 32,
      type: "word",
      value: "serif",
    }]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px @font, serif"),
    [{
      sourceIndex: 29,
      type: "word",
      value: "serif",
    }]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px var(--font), serif"),
    [{
      sourceIndex: 35,
      type: "word",
      value: "serif",
    }]
  )
  t.deepEqual(
    findFontFamily("bold italic 110% serif"),
    [{
      sourceIndex: 17,
      type: "word",
      value: "serif",
    }]
  )
  t.deepEqual(
    findFontFamily("normal small-caps 12px/14px fantasy"),
    [{
      sourceIndex: 28,
      type: "word",
      value: "fantasy",
    }]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px Georgia, serif"),
    [
      {
        sourceIndex: 22,
        type: "word",
        value: "Georgia",
      },
      {
        sourceIndex: 31,
        type: "word",
        value: "serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic  bold  12px  /  30px  Georgia,  serif"),
    [
      {
        sourceIndex: 29,
        type: "word",
        value: "Georgia",
      },
      {
        sourceIndex: 39,
        type: "word",
        value: "serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px Lucida Grande, Arial, sans-serif"),
    [
      {
        sourceIndex: 22,
        type: "word",
        value: "Lucida Grande",
      },
      {
        sourceIndex: 37,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 44,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/ 30px Lucida Grande, Arial, sans-serif"),
    [
      {
        sourceIndex: 23,
        type: "word",
        value: "Lucida Grande",
      },
      {
        sourceIndex: 38,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 45,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px /30px Lucida Grande, Arial, sans-serif"),
    [
      {
        sourceIndex: 23,
        type: "word",
        value: "Lucida Grande",
      },
      {
        sourceIndex: 38,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 45,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic 1000 12px /30px Lucida Grande, Arial, sans-serif"),
    [
      {
        sourceIndex: 23,
        type: "word",
        value: "Lucida Grande",
      },
      {
        sourceIndex: 38,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 45,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px Lucida Grande, Arial, sans-serif"),
    [
      {
        sourceIndex: 22,
        type: "word",
        value: "Lucida Grande",
      },
      {
        sourceIndex: 37,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 44,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px \"Red/Black\", Arial, sans-serif"),
    [
      {
        quote: "\"",
        sourceIndex: 22,
        type: "string",
        value: "Red/Black",
      },
      {
        sourceIndex: 35,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 42,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px Arial, \"Ahem!\", sans-serif"),
    [
      {
        sourceIndex: 22,
        type: "word",
        value: "Arial",
      },
      {
        quote: "\"",
        sourceIndex: 29,
        type: "string",
        value: "Ahem!",
      },
      {
        sourceIndex: 38,
        type: "word",
        value: "sans-serif",
      },
    ]
  )
  t.deepEqual(
    findFontFamily("italic bold 12px/30px \"Hawaii 5-0\", Arial, sans-serif"),
    [
      {
        quote: "\"",
        sourceIndex: 22,
        type: "string",
        value: "Hawaii 5-0",
      },
      {
        sourceIndex: 36,
        type: "word",
        value: "Arial",
      },
      {
        sourceIndex: 43,
        type: "word",
        value: "sans-serif",
      },
    ]
  )

  t.deepEqual(
    findFontFamily("16px/3 Arial"),
    [
      {
        sourceIndex: 7,
        type: "word",
        value: "Arial",
      },
    ]
  )

  t.end()
})
