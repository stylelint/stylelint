# Glossary

The words the docs use, and the words we don't use for them. For CSS terms, use the names in the specifications and on MDN.

| Term                                            | Meaning                                                                                             | Not                                                     |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| rule                                            | What reports one kind of problem.                                                                   | a check, a lint                                         |
| check                                           | What a rule does.                                                                                   | applies to, examine, inspect, validate                  |
| report                                          | How a rule raises a problem.                                                                        | flag                                                    |
| problem                                         | What a rule reports, at the configured [`severity`](../user-guide/configure.md#severity).           | finding, issue, violation, warning                      |
| fix, autofix                                    | The change a rule makes with the [`fix`](../user-guide/options.md#fix) option. Autofix is the noun. | auto-correct, repair                                    |
| message argument                                | What a rule passes to the [`message`](../user-guide/configure.md#message) option.                   | parameter, placeholder, variable                        |
| primary option, secondary option                | The required first option, and the optional object after it.                                        | flag, options object, setting                           |
| notation                                        | One of several equivalent forms.                                                                    | format, style                                           |
| convention                                      | A choice settled once for your codebase.                                                            | preference, style                                       |
| avoid, allow, disallow, require, limit, enforce | What a rule does for you.                                                                           | ban, catch, ensure, forbid, keep, permit, prevent, stop |
| CSS                                             | What the specifications define, as opposed to CSS-like languages such as SCSS.                      | plain CSS, standard CSS                                 |
