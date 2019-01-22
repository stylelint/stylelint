# selector-max-compound-selectors

Limit the number of compound selectors in a selector.

```css
   div .bar[data-val] > a.baz + .boom > #lorem {}
/* ↑   ↑                ↑       ↑       ↑
   |   |                |       |       |
  Lv1 Lv2              Lv3     Lv4     Lv5  -- these are compound selectors */
```

A [compound selector](https://www.w3.org/TR/selectors4/#compound) is a chain of one or more simple (tag, class, ID, universal, attribute) selectors. If there is more than one compound selector in a complete selector, they will be separated by combinators (e.g. ` `, `+`, `>`). One reason why you might want to limit the number of compound selectors is described in the [SMACSS book](https://smacss.com/book/applicability).

This rule resolves nested selectors before calculating the depth of a selector.

`:not()` is considered one compound selector irrespective to the complexity of the selector inside it. The rule *does* process that inner selector, but does so separately, independent of the main selector.

## 选项

`int`: Maximum compound selectors allowed.

例如，使用 `3`：

以下模式被视为违规：

```css
.foo .bar .baz .lorem {}
```

```css
.foo .baz {
  & > .bar .lorem {}
}
```

以下模式*不*被视为违规：

```css
div {}
```

```css
.foo div {}
```

```css
#foo #bar > #baz {}
```

```css
.foo + div :not (a b ~ c) {} /* `a b ~ c` is inside :not() and is processed separately */
```
