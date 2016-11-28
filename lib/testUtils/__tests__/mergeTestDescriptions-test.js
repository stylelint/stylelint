"use strict"

const mergeTestDescriptions = require("../mergeTestDescriptions")
const test = require("tape")

test("merge objects", t => {
  t.deepEqual(mergeTestDescriptions({}, {}), {}, "empty object")
  t.deepEqual(mergeTestDescriptions({
    foo: {
      foo: "bar",
      same: "foo",
    },
  }, {
    foo: {
      bar: "foo",
      same: "bar",
    },
  }), {
    foo: {
      foo: "bar",
      bar: "foo",
      same: "bar",
    },
  }, "objects")
  t.deepEqual(mergeTestDescriptions({
    accept: [{
      code: "foo",
      description: "bar",
    }],

    reject: [{
      code: "foo",
      message: "bar",
    }],
  }, {
    accept: [{
      code: "bar",
      description: "foo",
    }],

    reject: [{
      code: "bar",
      message: "foo",
    }],
  }), {
    accept: [ {
      code: "foo",
      description: "bar",
    }, {
      code: "bar",
      description: "foo",
    } ],

    reject: [ {
      code: "foo",
      message: "bar",
    }, {
      code: "bar",
      message: "foo",
    } ],
  }, "object with arrays")
  t.end()
})
