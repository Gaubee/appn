# Min-Navigation

一个极简的NavigationAPI替代品，基于HistoryAPI进行实现。
我们知道NavigationAPI在理论上是无法被直接polyfill的。但是因为有了appn这个框架的理念，我们将NavigationAPI限定在appn这个框架内，因此让一起也都有了可能。

因此Min-Navigation就是专门为appn定制的垫片，它足够小巧，但满足了NavigationAPI的标准。

当然，Min-Navigation可以独立使用，但请注意，它的定位是ponyfill，而不是polyfill。
因此它也不会去拦截`<a>`点击，一切都需要使用 ponyfill 所提供的API来进行使用。
当然，它的本质是基于HistoryAPI来进行实现。所以它会响应浏览器的前进后退刷新等行为。