# Appn

Appn 是一个专注于构建 WebApp 的框架，基于 WebComponent 技术与一些先进的、面向未来的 Web 标准，目的构建出高性能的 WebApp 体验。

Appn 由以下这三个部分组成：

1. `<appn-*>` 这是该项目的核心，围绕“导航”展开。
   1. `<appn-navigation>` 参考 NavigationAPI 的接口设计，提供了一套 WebComponent，将 NavigationAPI 与 DOM 进行双向关联的路由框架。
      1. `<appn-link>` 提供 `navigation.navigate()/.back()/.forward()/.traverseTo()` 的能力
      1. `<appn-navigation-history-entry>` 提供了 `NavigationHistoryEntry` 的能力
      1. _etc._
   1. `<appn-page>` 提供了应用页面的 生命周期、主题管理 等能力
1. `<css-*>` 提供了现代高级 CSS 的兼容性支持。
   > 不同于传统的兼容性思路（使用css兼容css，或者用js兼容css），`<css-*>`使用 html 兼容 css，目的是使用 WebComponent 的生命周期与层级结构来做 CSS 绑定，优先使用原生CSS来做实现，融合使用 JS 和 CSS 来做适配性支持。因此可以与所有的框架进行兼容（React、Vue、Angular等等）。这个方案具有高性能、高可靠的特性。
   >
   > > 注意：这些垫片的目的并不是100%的兼容（但是会往这个方向去努力，但这是一个平衡，因为这会导致垫片文件的体积变大）。主要目的是满足大部分需求场景，或者一些主流功能的需求。
1. `<fuse-*` 提供了高级UX 的开发支持。
   > 使用html的声明式绑定能力，将一些动画交互通过声明式的方式来实现（以往需要你使用专门的js代码配合css代码来实现）。
   >
   > 有一些 `<css-*>` 难以完成的复合型垫片，通常会在 `<fuse-*>` 这里开发一些专项型的垫片，以满足特定的交互需求。（比如一些关于滚动动画的交互）

## Dev & Build

To watch the site files, and re-build automatically, run:

```bash
pnpm dist:watch # gen /dist/
pnpm analyze:watch # gen /custom-elements.json
pnpm bundle:watch # gen /bundle/ (depends on /dist/)
pnpm 11ty:watch # gen /docs/ (depends on /bundle/ and /custom-elements.json)
```

The site will usually be served at http://localhost:8000.

## Linting

To lint the project run:

```bash
pnpm lint
```

## Test

To test the project run:

```bash
pnpm test:dev
```

## TODO

- [ ] 对架构进行拆分成monorepo项目
  - appn
  - @gaubee/lib
  - @gaubee/web
    - @gaubee/css
  - @gaubee/fuse
