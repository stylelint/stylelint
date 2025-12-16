# selector-max-attribute

Limit the number of attribute selectors in a selector.

<!-- prettier-ignore -->
```css
    [rel="external"] {}
/** ↑
 * This type of selector */
```

Each selector in a [selector list](https://drafts.csswg.org/selectors-4/#grouping) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum attribute selectors allowed.

Given:

```json
{
  "selector-max-attribute": 2
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
[type="number"][name="quality"][data-attribute="value"] {}
```

<!-- prettier-ignore -->
```css
[type="number"][name="quality"][disabled] {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[type="text"] {}
```

<!-- prettier-ignore -->
```css
[type="text"][name="message"] {}
```

<!-- prettier-ignore -->
```css
[type="text"][disabled] {}
```

<!-- prettier-ignore -->
```css
[type="text"][name="message"] {
  & [disabled] {}
}
```

## Optional secondary options

### `ignoreAttributes`

```json
{ "ignoreAttributes": ["array", "of", "attributes", "/regex/"] }
```

Given:

```json
{
  "selector-max-attribute": [0, { "ignoreAttributes": ["/^data-my-/", "dir"] }]
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
[dir] [data-my-attr] {}
```

<!-- prettier-ignore -->
```css
[dir] [data-my-other-attr] {}
```
