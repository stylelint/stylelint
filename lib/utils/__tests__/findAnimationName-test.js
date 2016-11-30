"use strict"

const findAnimationName = require("../findAnimationName")
const test = require("tape")

test("findAnimationName", t => {
  t.deepEqual(findAnimationName("inherit"), [{
    sourceIndex: 0,
    type: "word",
    value: "inherit",
  }])
  t.deepEqual(findAnimationName("INHERIT"), [{
    sourceIndex: 0,
    type: "word",
    value: "INHERIT",
  }])
  t.deepEqual(findAnimationName("3s @varialbe"), [])
  t.deepEqual(findAnimationName("3s #{$variable}"), [])
  t.deepEqual(findAnimationName("none"), [])
  t.deepEqual(findAnimationName("slidein"), [{
    sourceIndex: 0,
    type: "word",
    value: "slidein",
  }])
  t.deepEqual(findAnimationName("3s slidein"), [{
    sourceIndex: 3,
    type: "word",
    value: "slidein",
  }])
  t.deepEqual(findAnimationName("none slidein"), [{
    sourceIndex: 5,
    type: "word",
    value: "slidein",
  }])
  t.deepEqual(findAnimationName("3s linear 1s slidein"), [{
    sourceIndex: 13,
    type: "word",
    value: "slidein",
  }])
  t.deepEqual(findAnimationName("3S LINEAR 1S SLIDEIN"), [{
    sourceIndex: 13,
    type: "word",
    value: "SLIDEIN",
  }])
  t.deepEqual(findAnimationName("3s ease-in 1s 2 reverse both paused slidein"), [{
    sourceIndex: 36,
    type: "word",
    value: "slidein",
  }])
  t.deepEqual(findAnimationName("go-left-right 3s infinite alternate"), [{
    sourceIndex: 0,
    type: "word",
    value: "go-left-right",
  }])
  t.deepEqual(findAnimationName("shrink 2s ease-out, pulsate 4s 2s infinite ease-in-out"), [ {
    sourceIndex: 0,
    type: "word",
    value: "shrink",
  }, {
    sourceIndex: 20,
    type: "word",
    value: "pulsate",
  } ])
  t.deepEqual(findAnimationName("drive 4s steps(4, end) infinite"), [{
    sourceIndex: 0,
    type: "word",
    value: "drive",
  }])

  t.end()
})
