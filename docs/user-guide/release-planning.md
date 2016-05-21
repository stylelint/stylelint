# Release planning

Sometimes an upcoming release needs a little extra planning (and help from the stylelint community) to make the transition as smooth as possible.

## `7.0.0`

In `7.0.0` we will be removing the `emptyLineBefore` option from the `declaration-block-properties-order` rule and the `hierarchicalSelectors` option from the `indentation` rule. This is to ensure that development on the linter remains sustainable.

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

All being well, the community will, if there is a need, create these plugins while the stylelint team focuses on developing `7.0.0`. This will provide a smoother transition to `7.0.0`, once it is ready.
