# Ignoring code

You can ignore:

- parts of a file
- files entirely

## Parts of a file

You can temporarily turn off rules using configuration comments in your CSS.

For example, you can either turn all the rules off with an unscoped disable comment:

<!-- prettier-ignore -->
```css
/* stylelint-disable */
a {}
/* stylelint-enable */
```

Or you can turn off individual rules with a scoped disable comment:

<!-- prettier-ignore -->
```css
/* stylelint-disable selector-max-id, declaration-no-important */
#id {
  color: pink !important;
}
/* stylelint-enable selector-max-id, declaration-no-important */
```

You can turn off rules for individual lines with a `/* stylelint-disable-line */` comment, after which you do not need to explicitly re-enable them:

<!-- prettier-ignore -->
```css
#id { /* stylelint-disable-line */
  color: pink !important; /* stylelint-disable-line declaration-no-important */
}
```

You can also turn off rules for _the next line only_ with a `/* stylelint-disable-next-line */` comment, after which you do not need to explicitly re-enable them:

<!-- prettier-ignore -->
```css
#id {
  /* stylelint-disable-next-line declaration-no-important */
  color: pink !important;
}
```

Stylelint supports complex, overlapping disabling & enabling patterns:

<!-- prettier-ignore -->
```css
/* stylelint-disable */
/* stylelint-enable foo */
/* stylelint-disable foo */
/* stylelint-enable */
/* stylelint-disable foo, bar */
/* stylelint-disable baz */
/* stylelint-enable baz, bar */
/* stylelint-enable foo */
```

> [!WARNING]
> Configuration commands in non-standard syntax comments (e.g. `// stylelint-disable`) are only minimally supported.  
> They will only work when found outside of selectors or value lists.

You may also include a description at the end of the comment, after two hyphens:

```css
/* stylelint-disable -- Reason for disabling Stylelint. */
/* stylelint-disable foo -- Reason for disabling the foo rule. */
/* stylelint-disable foo, bar -- Reason for disabling the foo and bar rules. */
```

> [!WARNING]
> There must be a space on both sides of the hyphens.

## Files entirely

You can use a `.stylelintignore` file to ignore specific files. For example:

```
vendor/**/*.css
```

The patterns in your `.stylelintignore` file must match [`.gitignore` syntax](https://git-scm.com/docs/gitignore). (Behind the scenes, [`node-ignore`](https://github.com/kaelzhang/node-ignore) parses your patterns.) _Your patterns in `.stylelintignore` are always analyzed relative to `process.cwd()`._

Stylelint looks for a `.stylelintignore` file in `process.cwd()`. You can also specify a path to your ignore patterns file (absolute or relative to `process.cwd()`) using the [`--ignore-path`](cli.md#--ignore-path--i) (in the CLI) and [`ignorePath`](options.md#ignorepath) (in JS) options.

For convenience, if a `.gitignore` file is already present it can be substituted for `.stylelintignore`
e.g.

```shell
stylelint "*.css" --ignore-path .gitignore
```

Alternatively, you can add an [`ignoreFiles` property](configure.md#ignorefiles) within your configuration object.
