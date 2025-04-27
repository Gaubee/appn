# Shared-Element

一个基于 ViewTransitionAPI 的构建的跨视图（appn-page）共享元素动画的库。

我们知道ViewTransitionAPI是一套非常强大的动画方案，其提案内容也相对复杂，包括spa/mpa。
它越强大，同时就意味着对其进行polyfill的成本就越高，同时最终方案的性能也会更低。

因此这个库的目的是对 ViewTransitionAPI 的能力进行定向封装，专门用于满足 SharedElement 这个需求。
这样可以降低 polyfill 成本，同时也能确保 polyfill 方案的性能。

> 注意，SharedElement 的设计与 appn 进行了深度绑定，不建议独立使用
