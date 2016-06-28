import findListStyleType from "../findListStyleType"
import test from "tape"

test("findListStyleType", t => {
  t.deepEqual(
    findListStyleType("inherit"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "inherit",
    }]
  )
  t.deepEqual(
    findListStyleType("INHERIT"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "INHERIT",
    }]
  )
  t.deepEqual(
    findListStyleType("none"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "none",
    }]
  )
  t.deepEqual(
    findListStyleType("circle"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "circle",
    }]
  )
  t.deepEqual(
    findListStyleType("inside"),
    []
  )
  t.deepEqual(
    findListStyleType("url('kayo.jpg')"),
    []
  )
  t.deepEqual(
    findListStyleType("url('marker.gif') inside"),
    []
  )
  t.deepEqual(
    findListStyleType("square outside"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "square",
    }]
  )
  t.deepEqual(
    findListStyleType("inside square"),
    [{
      sourceIndex: 7,
      type: "word",
      value: "square",
    }]
  )
  t.deepEqual(
    findListStyleType("square inside url('sqpurple.gif')"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "square",
    }]
  )
  t.deepEqual(
    findListStyleType("SQUARE INSIDE URL('sqpurple.gif')"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "SQUARE",
    }]
  )
  t.deepEqual(
    findListStyleType("url('sqpurple.gif') square inside"),
    [{
      sourceIndex: 20,
      type: "word",
      value: "square",
    }]
  )
  t.deepEqual(
    findListStyleType("square url('sqpurple.gif') inside"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "square",
    }]
  )
  t.deepEqual(
    findListStyleType("custom-counter-style"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "custom-counter-style",
    }]
  )
  t.deepEqual(
    findListStyleType("customCounterStyle"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "customCounterStyle",
    }]
  )
  t.deepEqual(
    findListStyleType("inside custom-counter-style"),
    [{
      sourceIndex: 7,
      type: "word",
      value: "custom-counter-style",
    }]
  )
  t.deepEqual(
    findListStyleType("custom-counter-style outside"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "custom-counter-style",
    }]
  )
  t.deepEqual(
    findListStyleType("url('sqpurple.gif') custom-counter-style outside"),
    [{
      sourceIndex: 20,
      type: "word",
      value: "custom-counter-style",
    }]
  )
  t.deepEqual(
    findListStyleType("custom-counter-style url('sqpurple.gif') outside"),
    [{
      sourceIndex: 0,
      type: "word",
      value: "custom-counter-style",
    }]
  )
  t.deepEqual(
    findListStyleType("url('sqpurple.gif') outside custom-counter-style"),
    [{
      sourceIndex: 28,
      type: "word",
      value: "custom-counter-style",
    }]
  )

  t.end()
})
