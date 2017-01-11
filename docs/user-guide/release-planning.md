# Release planning

Sometimes an upcoming release needs a little extra planning (and help from the stylelint community) to make the transition as smooth as possible.

## `8.0.0`

In `8.0.0` we will be removing:

-   the `block-no-single-line` rule.
-   the `custom-property-no-outside-root` rule.
-   the `declaration-block-no-ignored-properties` rule.
-   the `declaration-block-properties-order` rule.
-   the `no-browser-hacks` rule.
-   the `no-indistinguishable-colors` rule.
-   the `no-unsupported-browser-features` rule.
-   the `root-no-standard-properties` rule.
-   the `selector-root-no-composition` rule.
-   the `stylelint-disable-reason` rule.

The `declaration-block-properties-order` rule will be replaced by [`stylelint-order`](https://github.com/hudochenkov/stylelint-order), a community plugin pack of ordering rules. One that contains rules for ordering properties, property groups and *other things* within declaration blocks. Please consider contributing to `stylelint-order` to ensure it is robust and handles your particular use-case in time for `8.0.0`.

The `block-no-single-line` rule can be achieved using:

```
{
  "block-opening-brace-newline-after": ["always"],
  "block-closing-brace-newline-before": ["always"]
}
```

There is little to do here other than update your config and check that this approach works for you.

The following three rules wrap existing PostCSS linting tools:

-   `no-browser-hacks` wraps [stylehacks](https://github.com/ben-eb/stylehacks).
-   `no-indistinguishable-colors` wraps [colorguard](https://github.com/SlexAxton/css-colorguard).
-   `no-unsupported-browser-features` wraps [doiuse](https://github.com/anandthakker/doiuse).

You can use the tool directly in your task runner of choice. However, if you find stylelint adds a feature (e.g. ignoring of files, `stylelint-disable` commands etc) that perhaps the tool itself lacks, then please consider converting the rule to a plugin for the community.

If you have a need for any of the remaining rules:

-   the `custom-property-no-outside-root` rule.
-   the `declaration-block-no-ignored-properties` rule.
-   the `root-no-standard-properties` rule.
-   the `selector-root-no-composition` rule.
-   the `stylelint-disable-reason` rule.

Please consider converting it to a plugin and sharing it with the community.

## `7.0.0`

In `7.0.0` we will be removing:

-   the `emptyLineBefore` option from the `declaration-block-properties-order` rule.
-   the `hierarchicalSelectors` option from the `indentation` rule.
-   the `-e` and `--extract` CLI flags and the `extractStyleTagsFromHtml` node API option.

This is to ensure that development on the linter remains sustainable.

The `declaration-block-properties-order` rule will, as the name implies, check only the order of properties within a declaration block. It will not be concerned with whitespace between declarations. As such, the `emptyLineBefore` option within the "group objects" configuration feature, i.e:

```json
[
  {
    "emptyLineBefore": "always",
    "properties": [
      "height",
      "width",
    ],
  }, {
    "emptyLineBefore": "always",
    "properties": [
      "color",
      "font",
    ],
  }
]
```

will be removed in `7.0.0`. This is an opportunity for the community to develop a more powerful and open-ended plugin for specifying the *structure of a block*. There's also an opportunity to align such a plugin with an existing block sorting PostCSS plugin, e.g. [`postcss-sorting`](https://github.com/hudochenkov/postcss-sorting), which supports, amongst other things, specifying the order of nested rules and at-rules within a block.

The `indentation` rule will only check the more common use-case of block-level indentation. As such, the `hierarchicalSelectors` option will be removed. If you use the `hierarchicalSelectors` option please consider creating a plugin for this specific code style and sharing it with the community.

The `-e` and `--extract` flags and the `extractStyleTagsFromHtml` node API option will be replaced by an extensible processor system. If you currently use these flags or this option to extract CSS code from HTML files, please consider [building a processor](../developer-guide/processors.md) for the community.

All being well, the community will, if there is a need, create these plugins and processors while the stylelint team focuses on developing `7.0.0`. This will provide a smoother transition to `7.0.0`, once it is ready.
