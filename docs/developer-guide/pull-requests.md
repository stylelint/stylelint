# 审查拉取请求

经验法则：

-   使用[GitHub审查系统](https://help.github.com/articles/about-pull-request-reviews/)。
-   根据[开发人员指南标准](rules.md)进行审核。
-   在请求更改时，分配一个或多个适当的 [`PR：needs *`标签](https://github.com/stylelint/stylelint/labels)。
-   通过[变基](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)解决冲突，而不是将目标分支合并到拉取请求分支中。

合并过程：

1.  确保拉取请求具有正确的批准数量：
    -   对于简单的文档修复：一个；
    -   对于所有其他拉取请求：两个。
2.  “压扁和合并”提交，确保生成的提交消息格式一致：
    -   判定用例.
    -   描述性.
3.  为所有合并的拉取请求（文档更改除外）直接通过 [GitHub 网站](https://github.com/stylelint/stylelint/edit/master/CHANGELOG.md)更新[更改日志](https://github.com/stylelint/stylelint/blob/master/CHANGELOG.md)：
    -   如果尚不存在，则创建一个`## [Head]`标题。
    -   为 `[Head]` 标题创建比较 URL（如果尚不存在）。例如 `[Head]: https://github.com/stylelint/stylelint/compare/9.10.0...HEAD`
    -   使用以下任一项作为项目前缀：Removed, Changed, Deprecated, Added, 或 Fixed.
    -   对组中的项目按目的范围最宽到最小的进行排序，然后按规则名称按字母顺序排序。
    -   对项目添加后缀，使用相关的拉取请求号码，完整的 GitHub URL，以使其在[网站](https://stylelint.io/CHANGELOG/)上能够工作。
    -   如果适用，请将规则名称引入项目，例如“Fixed: `unit-blacklist` false positives for SCSS nested properties”。
4.  最后，将该项目作为对拉取请求的注释发布。
