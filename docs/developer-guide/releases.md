# 执行发布

主要目标是：

1.  将更新的包发布到 npm。
2.  使用创建带记录的 GitHub 版本。

次要目标是：

1.  确保 stylelint 组织的 `stylelint-config-*` 可共享配置与该版本兼容。
2.  在 [https://stylelint.io/demo](https://stylelint.io/demo) 更新在线演示以使用该版本。
3.  更新 [https://stylelint.io](https://stylelint.io) 上的文档以使用该版本。
4.  发送推文。

## 过程

1.  创建一个[新问题](https://github.com/stylelint/stylelint/issues/new)，宣布计划发布，例如 `Release 8.11.1` 并包含[模板清单](#新版本问题模板)。
2.  在 `stylelint-config-*` 可共享配置储存库中本地测试 `master`。
3.  在 `stylelint.io` 储存库中本地测试 `master`。
4.  在 `stylelint-demo` 储存库中本地测试 `master`。
5.  使用 [`npmpub`](https://github.com/MoOx/npmpub)将包发布到 npm 并创建 github 版本：
    1.  确保更改日志的[格式一致性](pull-requests.md)。
    2.  运行 `npm --no-git-tag-version version major|minor|patch` 来增加 `package.json` 和 `package-lock.json` 中的 `version` 号，根据它是否是补丁、次要或主要版本。
    3.  在以下相关的位置更新 `CHANGELOG.md` 中的 `[Head]` 。
        -   用这个新的版本号替换 `## [Head]`，例如 `## [8.1.2]`
        -   用这个新的版本号替换 `[Head]: https://github.com/stylelint/stylelint/compare/{version}...HEAD`，例如 `[8.1.2]: https://{...omitted...}/compare/8.1.1...8.1.2`.
    4.  提交并 _上推_ 这些更改。
    5.  访问 [https://github.com/stylelint/stylelint](https://github.com/stylelint/stylelint) 并确认这些更改被推上了而且正确。
    6.  运行 `npm run release` （测试应该通过，否则无法发布）
    7.  运行 `NPM_CONFIG_OTP=123456 npm run release -- --skip-test --skip-cleanup`
    8.  访问 [https://www.npmjs.com/package/stylelint](https://www.npmjs.com/package/stylelint) 并确认包已正确发布。
    9.  访问 [https://github.com/stylelint/stylelint/releases](https://github.com/stylelint/stylelint/releases) 并确认已正确创建版本。
6.  如果需要任何 `stylelint-config-*` 的新版本，请对该储存库重复步骤5。
7.  通过更新 `stylelint-demo` 储存库更新在线演示：
    1.  运行 `npm install -S stylelint@latest`
    2.  运行 `npm test`
    3.  提交并 _上推_ 这些更改。
    4.  访问 [https://stylelint.io/demo](https://stylelint.io/demo) 并确认已自动部署更新。
8.  通过更新 `stylelint.io` 储存库更新更新网站文档：
    1.  运行 `npm install -D stylelint@latest`
    2.  运行 `npm test`
    3.  提交并 _上推_ 这些更改。
    4.  运行 `npm run deploy`.
    5.  访问 [https://stylelint.io](https://stylelint.io) 并确认已正确部署更新。
9.  编写一条推文，宣布发布，传达已更改的内容，并链接到[https://stylelint.io](https://stylelint.io)上更改日志中的相应标题。

## 新版本问题模板

```markdown
- [ ] stylelint release
- [ ] stylelint-config-recommended update/release
- [ ] stylelint-config-standard update/release
- [ ] stylelint-demo update
- [ ] stylelint.io update
- [ ] tweet

cc @stylelint/core
```
