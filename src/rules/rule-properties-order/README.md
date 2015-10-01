# rule-properties-order

Specify the order of properties within rules.

```css
    a {
      color: pink;
      top: 0;
    }
/**    ↑
 * These properties */
```

Prefixed properties *must always* be alphabetically order and *must always* preceed the unprefixed property.

## Options

`string|array`: `"alphabetical"|["array", "of", "unprefixed", "property", "names"]`

### `"alphabetical"`

Properties *must always* be ordered alphabetically.

The following patterns are considered warnings:

```css
a {
  top: 0;
  color: pink;
}
```

```css
a {
  -moz-transform: scale(1);
  transform: scale(1);
  -webkit-transform: scale(1);
}
```

The following patterns are *not* considered warnings:

```css
a {
  color: pink;
  top: 0;
}
```

```css
a {
  -moz-transform: scale(1);
  -webkit-transform: scale(1);
  transform: scale(1);
}
```

### `["array", "of", "unprefixed", "property", "names"]`

Properties *must always* be ordered to match that of the array.

There are some important details to keep in mind:

**By default, unlisted properties will be ignored.** So if you specify an array
and do not include `display`, that means that the `display` property can be
included before or after any other property. *This can be changed with the
`unspecified` option* (see below).

**If an (unprefixed) property name is not included in your array
and it contains a hyphen (e.g. `padding-left`), the rule will look for the string
before that first hyphen in your array (e.g. `padding`) and use that
position.** This means that you do not have to specify each extension of the root property;
you can just specify the root property and the extensions will be accounted for.

For example, if you have included `border` in your array but not
`border-top`, the rule will expect `border-top` to appear in the same relative
position as `border`.

Other relevant rules include `margin`, `border`, `animation`, `transition`, etc.

Using this fallback, the order of these hyphenated relative to their peer extensions
(e.g. `border-top` to `border-bottom`) will be *arbitrary*. If you would like to
enforce a specific ordering (e.g. always put `border-right` before `border-left`), you
should specify those particular names in your array.

Given:

```js
["transform", "top", "color"]
```

The following patterns are considered warnings:

```css
a {
  color: pink;
  top: 0;
}
```

```css
a {
  -moz-transform: scale(1);
  transform: scale(1);
  -webkit-transform: scale(1);
}
```

The following patterns are *not* considered warnings:

```css
a {
  top: 0;
  color: pink;
}
```

```css
a {
  -moz-transform: scale(1);
  -webkit-transform: scale(1);
  transform: scale(1);
}
```

Given:

```js
["padding", "color"]
```

The following patterns are considered warnings:

```css
a {
  color: pink;
  padding: 1em;
}
```

```css
a {
  color: pink;
  padding-top: 1em;
}
```

```css
a {
  padding-left: 2em;
  color: pink;
  padding-top: 1em;
}
```

The following patterns are *not* considered warnings:

```css
a {
  padding: 1em;
  color: pink;
}
```

```css
a {
  padding-top: 1em;
  color: pink;
}
```

```css
a {
  padding-left: 2em;
  padding-top: 1em;
  color: pink;
}
```

```css
a {
  padding-top: 1em;
  padding-left: 2em;
  color: pink;
}
```

Given:

```js
["padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "color"]
```

The following patterns are considered warnings:

```css
a {
  padding-left: 2em;
  padding-top: 1em;
  padding: 1em;
  color: pink;
}
```

The following patterns are *not* considered warnings:

```css
a {
  padding-top: 1em;
  padding-right: 1em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  color: pink;
}
```

```css
a {
  padding: 1em;
  padding-right: 2em;
  padding-left: 2.5em;
  color: pink;
}
```

## Optional options

### `unspecified: "top"|"bottom"|"ignore"`

These options only apply if you've defined your own array of properties.

Default behavior is the same as `"ignore"`: an unspecified property can appear before or after
any other property.

With `"top"`, unspecified properties are expected *before* any specified properties.
With `"bottom"`, unspecified properties are expected *after* any specified properties.

Given this configuration:

```js
[2, ["color", "background"], { unspecified: "ignore" }]
```

The following patterns are *not* considered warnings:

```css
a {
  color: pink;
  background: orange;
  left: 0;
}
```

```css
a {
  left: 0;
  color: pink;
  background: orange;
}
```

```css
a {
  color: pink;
  left: 0;
  background: orange;
}
```

Given this configuration:

```js
[2, ["color", "background"], { unspecified: "top" }]
```

The following patterns are considered warnings:


```css
a {
  color: pink;
  background: orange;
  left: 0;
}
```

```css
a {
  color: pink;
  left: 0;
  background: orange;
}
```


The following patterns are *not* considered warnings:

```css
a {
  left: 0;
  color: pink;
  background: orange;
}
```

Given this configuration:

```js
[2, ["color", "background"], { unspecified: "bottom" }]
```

The following patterns are considered warnings:


```css
a {
  left: 0;
  color: pink;
  background: orange;
}
```

```css
a {
  color: pink;
  left: 0;
  background: orange;
}
```


The following patterns are *not* considered warnings:

```css
a {
  color: pink;
  background: orange;
  left: 0;
}
```
