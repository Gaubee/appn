# Min-Navigation

一个极简的 NavigationAPI 替代品，基于 HistoryAPI 进行实现。
我们知道 NavigationAPI 在理论上是无法被直接 polyfill 的。但是因为有了 appn 这个框架的理念，我们将NavigationAPI 限定在 appn 这个框架内，因此让一起也都有了可能。

因此 Min-Navigation 就是专门为 appn 定制的垫片，它足够小巧，但满足了NavigationAPI的标准。

当然，Min-Navigation可以独立使用，但请注意，它的定位是 ponyfill ，而不是 polyfill。
因此它也不会去拦截 `<a>` 点击，一切都需要使用 ponyfill 所提供的API来进行使用。
当然，它的本质是基于 HistoryAPI 来进行实现。所以它会响应浏览器的前进后退刷新等行为。
