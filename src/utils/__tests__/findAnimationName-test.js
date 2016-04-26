import test from "tape"
import findAnimationName from "../findAnimationName"

const animationNames = new Set([
  "animation-name",
])

const times = new Set([
  // Custom values for test
  "1s", "2s", "3s",
])

const timingFunctions = new Set([
  "linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end",
  "steps(start)", "steps(end)",
  // Custom values for test
  "steps(1)", "steps(2)", "steps(3)",
  "cubic-bezier(.17,.67,.83,.67)", "cubic-bezier(.8,.3,.83,.67)", "cubic-bezier(.8,.3,.27,.89)",
  "initial", "inherit",
])

const animationIterationCounts = new Set([
  "infinite", "initial", "inherit",
  // Custom values for test
  "1", "2", "3",
])

/*
const animationDirections = new Set([
  "normal", "reverse", "alternate", "alternate-reverse", "initial", "inherit",
])

const animationFillMode = new Set([
  "none", "forwards", "backwards", "both", "initial", "inherit",
])

const animationPlayState = new Set([
  "running", "paused", "initial", "inherit",
])
*/

test("findAnimationName", t => {
  animationNames.forEach((name) => {
    t.deepEqual(findAnimationName(name), [{ name, index: 0 }])

    times.forEach((time) => {
      t.deepEqual(findAnimationName(name + " " + time), [{ name, index: 0 }])
      t.deepEqual(findAnimationName(time + " " + name), [{ name, index: 1 }])

      timingFunctions.forEach((timingFunction) => {
        t.deepEqual(findAnimationName(name + " " + time + " " + timingFunction), [{ name, index: 0 }])
        t.deepEqual(findAnimationName(name + " " + timingFunction + " " + time), [{ name, index: 0 }])
        t.deepEqual(findAnimationName(timingFunction + " " + name + " " + time), [{ name, index: 1 }])
        t.deepEqual(findAnimationName(time + " " + name + " " + timingFunction), [{ name, index: 1 }])
        t.deepEqual(findAnimationName(timingFunction + " " + time + " " + name), [{ name, index: 2 }])
        t.deepEqual(findAnimationName(time + " " + timingFunction + " " + name), [{ name, index: 2 }])

        animationIterationCounts.forEach((animationIterationCount) => {
          t.deepEqual(findAnimationName(
              name + " " + time + " " + animationIterationCount + " " + timingFunction),
            [{ name, index: 0 }]
          )
          t.deepEqual(findAnimationName(
              name + " " + animationIterationCount + " " + time + " " + timingFunction),
            [{ name, index: 0 }]
          )
          t.deepEqual(findAnimationName(
              name + " " + animationIterationCount + " " + timingFunction + " " + time),
            [{ name, index: 0 }]
          )
          t.deepEqual(findAnimationName(
              animationIterationCount + " " + name + " " + time + " " + timingFunction),
            [{ name, index: 1 }]
          )
          t.deepEqual(findAnimationName(
              animationIterationCount + " " + name + " " + timingFunction + " " + time),
            [{ name, index: 1 }]
          )
          t.deepEqual(findAnimationName(
              animationIterationCount + " " + time + " " + name + " " + timingFunction),
            [{ name, index: 2 }]
          )
          t.deepEqual(findAnimationName(
            animationIterationCount + " " + timingFunction + " " + name + " " + time),
            [{ name, index: 2 }]
          )
          t.deepEqual(findAnimationName(
            animationIterationCount + " " + timingFunction + " " + time + " " + name),
            [{ name, index: 3 }]
          )
          t.deepEqual(findAnimationName(
            animationIterationCount + " " + time + " " + timingFunction + " " + name),
            [{ name, index: 3 }]
          )

          // Need more test
        })
      })
    })
  })

  t.end()
})
