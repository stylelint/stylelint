# no-empty-source

Disallow empty sources.

```css
  ···\n\t
/**     ↑
 *  This empty source */
```

A source containing only whitespace is considered empty.

## Options

### `true`

The following patterns are considered warnings:

```css

```

```css
\t\t
```

```css
\n
```

The following patterns are *not* considered warnings:

```css
a {}
```

```css
/* Only comments */
```
