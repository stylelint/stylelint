# comment-empty-line-before

Require or disallow an empty line before comments.

<!-- prettier-ignore -->
```css
a {}
              /* ← */
/* comment */ /* ↑ */
/**              ↑
*        This line */
```

This rule ignores:

- comments that are the very first node in the source
- shared-line comments
- single-line comments with `//` (when you're using a custom syntax that supports them)
- comments within selector and value lists

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

### `"always"`

There _must always_ be an empty line before comments.

```json
{
  "comment-empty-line-before": "always"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}
/* comment */
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}

/* comment */
```

<!-- prettier-ignore -->
```css
a {} /* comment */
```

### `"never"`

There _must never_ be an empty line before comments.

```json
{
  "comment-empty-line-before": "never"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {}

/* comment */
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {}
/* comment */
```

<!-- prettier-ignore -->
```css
a {} /* comment */
```

## Optional secondary options

### `except`

```json
{ "except": ["array", "of", "options"] }
```

#### `"first-nested"`

Reverse the primary option for comments that are nested and the first child of their parent node.

Given:

```json
{
  "comment-empty-line-before": ["always", { "except": ["first-nested"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {

  /* comment */
  color: pink;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  /* comment */
  color: pink;
}
```

### `ignore`

```json
{ "ignore": ["array", "of", "options"] }
```

#### `"after-comment"`

Ignore comments that follow another comment.

Given:

```json
{
  "comment-empty-line-before": ["always", { "ignore": ["after-comment"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  background: pink;

  /* comment */
  /* comment */
  color: #eee;
}
```

<!-- prettier-ignore -->
```css
a {
  background: pink;

  /* comment */

  /* comment */
  color: #eee;
}
```

#### `"stylelint-commands"`

Ignore configuration comments, e.g. `/* stylelint-disable color-no-hex */`.

Given:

```json
{
  "comment-empty-line-before": ["always", { "ignore": ["stylelint-commands"] }]
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
a {
  background: pink;
  /* not a configuration comment */
  color: #eee;
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
a {
  background: pink;
  /* stylelint-disable color-no-hex */
  color: pink;
}
```

### `ignoreComments`

```json
{ "ignoreComments": ["array", "of", "comments", "/regex/"] }
```

Ignore comments matching the given regular expressions or strings.

Given:

```json
{
  "comment-empty-line-before": [
    "always",
    { "ignoreComments": ["/^ignore/", "string-ignore"] }
  ]
}
```

The following patterns are _not_ considered problems:

```css
:root {
  background: pink;
  /* ignore this comment because of the regex */
  color: pink;
}
```

```css
:root {
  background: pink;
  /* string-ignore */
  color: pink;
}
```
