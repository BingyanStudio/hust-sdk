# 代码贡献指南

> Ciallo ～(∠・ω< )⌒★!
> 感谢您对本项目的兴趣并愿意做出贡献！

为了确保贡献流程的顺利进行，请遵循以下指南。

## 分支命名

创建新分支时，请遵循以下命名约定：

- `feat/<feature-name>`：用于添加新功能。
- `fix/<short-description>-[<issue-id>]`：用于修复错误，如果有对应的 issue 请把 `issue-id` 带上。
- `docs/<area>`：用于改进文档。
- `refactor/<area>`：用于代码重构，不改变外部行为。
- `chore/<task>`：用于构建过程、辅助工具等不影响生产代码的更改。

例如：`feat/user-authentication` 或 `fix/123-login-button-bug`。

## Commit Message 规范

请参考 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

每个提交消息都应包含一个类型、一个可选的作用域和一个描述：

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- **type**:（建议）
  - `feat`: 新功能
  - `fix`: Bug 修复
  - `docs`: 文档更改
  - `style`: 代码风格更改（不影响代码含义的更改，例如空格、格式化、缺少分号等）
  - `refactor`: 代码重构（既不修复错误也不添加功能的代码更改）
  - `perf`: 性能改进
  - `test`: 添加缺失的测试或更正现有测试
  - `chore`: 对构建过程或辅助工具和库（如文档生成）的更改
- **scope** (可选): 指示提交影响的包或模块。
- **subject**: 简洁地描述更改。
- **body** (可选): 提供更详细的解释性文本。
- **footer** (可选): 包含有关重大更改 (Breaking Changes) 或关闭的 issue 的信息 (例如 `Closes #123`)。

示例：

```
feat: 添加用户登录功能

用户现在可以使用用户名和密码登录系统。

Closes #42
```

```
fix(cookie-manager): 修复请求发送过期 cookie 字段
```

## Pull Request (PR) 规范

1.  **Clone**: 将仓库克隆到本地。
2.  **创建分支**: 根据上述分支命名规范创建一个新分支。
3.  **编码**: 进行代码更改。确保遵循项目的编码风格和最佳实践。
4.  **测试**: 尽可能为更改的代码添加测试。确保本地所有测试都通过。
5.  **提交**: 按照上述 Commit Message 规范提交更改。
6.  **同步**: 在发起 PR 之前，请确保你的分支与上游主分支保持最新，以避免合并冲突。
7.  **发起 PR**:
    - 在 GitHub 上发起一个新的 Pull Request 到本仓库的主分支。
    - 在 PR 描述中清晰地说明你的更改内容、目的以及任何相关的 issue。
    - 如果你的 PR 解决了某个 issue，请在描述中使用 `Closes #<issue-id>` 或 `Fixes #<issue-id>`。
8.  **代码审查**: 等待项目维护者审查你的 PR。他们可能会提出问题或要求进行修改。请及时回应并进行必要的更改。
9.  **合并**: 一旦你的 PR 被批准，项目维护者会将其合并到主分支。
