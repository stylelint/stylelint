# root-no-standard-properties

***Deprecated: instead use the community [`stylelint-suitcss`](https://github.com/suitcss/stylelint-suitcss) plugin pack***

Disallow standard properties inside `:root` rules.

```css
    :root { color: #333 }
/** ↑       ↑
 * This selector and these types of standard properties */
```

This rule ignores `$sass` and `@less` variables.

## Options

### `true`

The following patterns are considered violations:

```css
:root { color: pink; }
```

```css
a, :root { top: 0; }
```

The following patterns are *not* considered violations:

```css
:root { --foo: 0; }
```

```css
a, :root { --foo: 0; }
```
