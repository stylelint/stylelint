# media-feature-range-notation

Specify context or prefix notation for media feature ranges.

<!-- prettier-ignore -->
```css
@media (width >= 600px) and (min-width: 600px) {}
/**    ↑                    ↑
 *     These media feature notations */
```

Use this rule to enforce a convention. A range media feature can be written with a `min-` or `max-` prefix, or in the [context notation](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using#targeting_media_features) with a comparison operator.

Choose:

- `"context"` to write ranges as comparisons, including the exclusive ones that [prefixes can't express](https://drafts.csswg.org/mediaqueries/#mq-min-max)
- `"prefix"` for older browsers, which don't support the context notation

The [`fix` option](../../../docs/user-guide/options.md#fix) can automatically fix some of the problems reported by this rule.

This rule supports 1 [message argument](../../../docs/user-guide/configure.md#message): the configured notation.

## Options

### `"context"`

Media feature ranges _must always_ use context notation.

```json
{
  "media-feature-range-notation": "context"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 1px) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 1px) and (max-width: 2px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (width >= 1px) {}
```

<!-- prettier-ignore -->
```css
@media (1px <= width <= 2px) {}
```

### `"prefix"`

Media feature ranges _must always_ use prefix notation.

```json
{
  "media-feature-range-notation": "prefix"
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@media (width >= 1px) {}
```

<!-- prettier-ignore -->
```css
@media (1px <= width <= 2px) {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@media (min-width: 1px) {}
```

<!-- prettier-ignore -->
```css
@media (min-width: 1px) and (max-width: 2px) {}
```

## Optional secondary options

### `except`

```json
{ "except": ["array", "of", "options"] }
```

#### `"exact-value"`

Reverse the primary option for media features with exact values.

Given:

```json
{
  "media-feature-range-notation": ["context", { "except": ["exact-value"] }]
}
```

The following pattern is considered a problem:

<!-- prettier-ignore -->
```css
@media (min-width: 1px) {}
```

The following pattern is _not_ considered a problem:

<!-- prettier-ignore -->
```css
@media (width: 1px) {}
```
