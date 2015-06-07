import { ruleTester } from "../testUtils"
import blockNoEmpty, {
  ruleName as blockNoEmptyName,
  messages as blockNoEmptyMessages
} from "../rules/block-no-empty"

const testBlockNoEmpty = ruleTester(blockNoEmpty, blockNoEmptyName)

testBlockNoEmpty("disabling all rules", tr => {
  tr.notOk("a {}", blockNoEmptyMessages.rejected)

  tr.ok("/* stylelint-disable */\na {}")

  tr.notOk("a {}\n/* stylelint-disable */", blockNoEmptyMessages.rejected)
  tr.ok("b { color: pink;}\n/* stylelint-disable */\na {}")
})

testBlockNoEmpty("disabling specific rules", tr => {
  tr.ok(`/* stylelint-disable ${blockNoEmptyName} */\na {}`)
  tr.notOk("/* stylelint-disable declaration-no-important */\na {}",
    blockNoEmptyMessages.rejected)
})

testBlockNoEmpty("multiple disabled ranges", tr => {
  tr.ok(
    "/* stylelint-disable */\n" +
    "a {}\n" +
    "/* stylelint-enable */\n" +
    "/* stylelint-disable */\n" +
    "a {}\n"
  )

  tr.notOk(
    "/* stylelint-disable */\n" +
    "a {}\n" +
    "/* stylelint-enable */\n" +
    "a {}\n",
    blockNoEmptyMessages.rejected
  )
})
