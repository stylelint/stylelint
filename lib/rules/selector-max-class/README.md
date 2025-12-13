# selector-max-class

Limit the number of classes in a selector.

<!-- prettier-ignore -->
```css
div .foo.bar[data-val] > a.baz {}
/*  ↑   ↑                 ↑
    ↑   ↑                 ↑
    1   2                 3  -- this selector contains three classes */
```

Each selector in a [selector list](https://www.w3.org/TR/selectors4/#selector-list) is evaluated separately.

> [!NOTE]
> In versions prior to `17.0.0`, this rule would evaluate functional pseudo-classes separately, such as `:not()` and `:is()`, and resolve nested selectors (in a nonstandard way) before counting.

## Options

### `number`

Specify a maximum classes allowed.

Given:

```json
{
  "selector-max-class": 2
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
.foo.bar.baz {}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
div {}
```

<!-- prettier-ignore -->
```css
.foo .bar {}
```
