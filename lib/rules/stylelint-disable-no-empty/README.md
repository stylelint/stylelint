# stylelint-disable-no-empty

When stylelint-disable comments are empty they disable all the rules in the disable range. This rule encourages disabling *individual* rules.

```css
a {
  /* stylelint-disable no-browser-hacks */ /*←*/
  _display: block;                         /*↑*/
  /* stylelint-enable no-browser-hacks */  /*↑*/
}                                          /*↑*/
/**                                          ↑
*                          This specific rule */
```
