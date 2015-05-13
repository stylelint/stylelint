import { ruleTester } from "../../../testUtils"
import selectorCombinatorSpace, { ruleName, messages } from ".."

const testSelectorCombinatorSpace = ruleTester(selectorCombinatorSpace, ruleName)

testSelectorCombinatorSpace({ before: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0, 0, 0")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1  , 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\n, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\t, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }", messages.expectedBefore())
})

testSelectorCombinatorSpace({ after: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0,0,0")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1,1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,  1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,\n1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,\t1); }", messages.expectedAfter())
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", messages.expectedAfter())
})

testSelectorCombinatorSpace({ before: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0 , 0 , 0")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0, 0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1 , 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1  , 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\n, 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\t, 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: color(rgb(0, 0 , 0) lightness(50%)); }", messages.rejectedBefore())

})

testSelectorCombinatorSpace({ after: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0, 0, 0")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0 ,0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,  1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,\n1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,\t1); }", messages.rejectedAfter())
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", messages.rejectedAfter())
})

testSelectorCombinatorSpace({ before: "always", after: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0,0,0")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: color(rgb(0 , 0 , 0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1  , 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\n, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\t, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1 ,1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1 ,  1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1 ,\n1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1 ,\t1); }", messages.expectedAfter())
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", messages.expectedAfter())
})

testSelectorCombinatorSpace({ before: "always", after: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0 ,0 ,0")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: color(rgb(0 ,0 ,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1,1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1  ,1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\n,1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\t,1); }", messages.expectedBefore())
  tr.notOk("a { transform: color(rgb(0 ,0,0) lightness(50%)); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1 ,  1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1 ,\n1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1 ,\t1); }", messages.rejectedAfter())
  tr.notOk("a { transform: color(rgb(0 ,0 , 0) lightness(50%)); }", messages.rejectedAfter())
})

testSelectorCombinatorSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0 ,0 ,0")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: color(rgb(0, 0, 0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1 , 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1  , 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\n, 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\t, 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: color(rgb(0, 0 , 0) lightness(50%)); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1,1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,  1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,\n1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,\t1); }", messages.expectedAfter())
  tr.notOk("a { transform: color(rgb(0, 0,0) lightness(50%)); }", messages.expectedAfter())
})

testSelectorCombinatorSpace({ before: "never", after: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("background-size: 0 , 0 , 0")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0,0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1 ,1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1  ,1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\n,1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\t,1); }", messages.rejectedBefore())
  tr.notOk("a { transform: color(rgb(0,0 ,0) lightness(50%)); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1, 1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,  1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,\n1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,\t1); }", messages.rejectedAfter())
  tr.notOk("a { transform: color(rgb(0,0, 0) lightness(50%)); }", messages.rejectedAfter())
  tr.notOk("a { transform: color(rgb(0,0, 0) lightness(50%)); }", messages.rejectedAfter())
})
