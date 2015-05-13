import { ruleTester } from "../../../testUtils"
import declarationCommaSpace, { ruleName, messages } from ".."

const testDeclarationCommaSpace = ruleTester(declarationCommaSpace, ruleName)

testDeclarationCommaSpace({ before: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0 ,0; }")

  tr.notOk("a { background-size: 0, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBefore())
})

testDeclarationCommaSpace({ before: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0,0; }")

  tr.notOk("a { background-size: 0 , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.rejectedBefore())
})

testDeclarationCommaSpace({ after: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")

  tr.notOk("a { background-size: 0,0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfter())
})

testDeclarationCommaSpace({ after: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")

  tr.notOk("a { background-size: 0, 0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.rejectedAfter())
})

testDeclarationCommaSpace({ before: "always", after: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0 , 0; }")

  tr.notOk("a { background-size: 0, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0 ,0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0 ,  0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0 ,\n0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0 ,\t0; }", messages.expectedAfter())
})

testDeclarationCommaSpace({ before: "always", after: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { background-size: 0 ,0; }")

  tr.notOk("a { background-size: 0,0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  ,0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\n,0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\t,0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0 , 0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0 ,  0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0 ,\n0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0 ,\t0; }", messages.rejectedAfter())
})

testDeclarationCommaSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { background-size: 0, 0; }")

  tr.notOk("a { background-size: 0 , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0,0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfter())
})

testDeclarationCommaSpace({ before: "never", after: "never" }, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { background-size: 0,0; }")

  tr.notOk("a { background-size: 0 ,0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0  ,0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\n,0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\t,0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0, 0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.rejectedAfter())
})
