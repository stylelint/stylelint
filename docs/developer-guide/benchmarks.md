# Benchmarks

There's a simple way to run benchmarks on any given rule with any valid config for it:

```shell
npm run benchmark-rule -- [rule-name] [config]
```

If the `config` argument is anything other than a string or a boolean, it must be valid JSON wrapped in quotation marks.

```shell
npm run benchmark-rule -- selector-combinator-space-after never
```

```shell
npm run benchmark-rule -- selector-combinator-space-after always
```

```shell
npm run benchmark-rule -- selector-no-combinator true
```

```shell
npm run benchmark-rule -- block-opening-brace-space-before "[\"always\", {\"ignoreAtRules\": [\"else\"]}]"
```

The script loads Bootstrap's CSS (from its CDN) and runs it through the configured rule.

It will end up printing some simple stats like this:

```shell
Warnings: 1441
Mean: 74.17598357142856 ms
Deviation: 16.63969674310928 ms
```

What can you do with this? **When writing new rules or refactoring existing rules, use these measurements to determine the efficiency of your code.**

A stylelint rule can repeat it's core logic many, many times (e.g. checking every value node of every declaration in a vast CSS codebase). So it's worth paying attention to performance and doing what we can to improve it!

**This is a great way to contribute if you just want a quick little project.** Try picking a rule and seeing if there's anything you can do to speed it up.

Make sure to include benchmark measurements in your PR's!
