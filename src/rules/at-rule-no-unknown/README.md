# at-rule-no-unknown

Disallow unknown at-rules.

```css
    @unknown (max-width: 960px) {}
/** ↑
 * At-rules like this */
```

## Options

### `true`

The following patterns are considered warnings:

```css
@unknown {}
```

The following patterns are *not* considered warnings:

```css
@charset "UTF-8";
```

```css
@CHARSET "UTF-8";
```

```css
@media (max-width: 960px) {}
```

```css
@font-feature-values Font One { 
  @styleset {} 
}
```

## Optional options

### `ignoreAtRules: ["array", "of", "at-rules"]`

Allow unknown at-rules.

Given:

```js
["unknown"]
```

The following patterns are considered warnings:

```css
@unknown-at-rule {}
```

The following patterns are *not* considered warnings:

```css
@media (max-width: 960px) { }
```

```css
@unknown {}
```

```css
@UNKNOWN {}
```
