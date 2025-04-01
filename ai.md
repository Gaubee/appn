我现在在设计一个webcomponent 框架，名字叫做appn（目前我使用lit@v3进行开发）

这个框架的目的是通过webcomponent技术，来提供一套web-app的导航能力。

1. appn 的目的是构建现代化的WebApp体验。目前市面上主要是 ionic 做得比较好。但我仍然觉得它的框架设计有一定的局限性。我的目的是构建一套更加接近于W3C组织会推荐的标准。
1. **`@appn/root`** 因此导航是一个很大的部分工作，因为它还包含了导航之间的动画（这点ionic就不够完善，很难做出理想的导航动画）。这是我初步的构想:

   ```html
   <appn-navigation-provider>
     <appn-page>
       <appn-link type="button" to="other">go to other page</appn-link>
     </appn-page>
   </appn-navigation-provider>
   ```

   1. `<appn-navigation-provider>`通过`@lit/context`技术，为子元素提供一套类似 navigation-api 的接口（`interface AppNavigation`）。
   1. 比如`<appn-page>` 可以得到 `@consume({context: appnNavigationHistoryEntry}) accessor currentEntry:NavigationHistoryEntry`，从而可以进一步基于当前路由信息渲染出页面内容
   1. 比如`<appn-link>` 可以得到 `@consume({context: appnNavigationContext}) accessor nav:AppNavigation`，从而可以基于nav对象进行路由操作 `nav.navigate(this.to)`
   1. 考虑到兼容性的问题，以及容器化的设计，`interface AppNavigation`的目的是提供一套和 navigation-api 基本一致的接口，底层可能会用到 navigation-api，但考虑到兼容性，可能更多的是参考其设计而不是直接使用，市面上有相关的垫片，需要100kb左右的引入，我会在初期尝试使用 navigation-api，校验垫片在这里的合理性，但我估计我可能前期会刻意使用 history-api 来满足基础能力的开发。
      > 我会尽可能实现 navigation-api 特有的高级功能，因为我会将 ViewTransactionAPI 封装给开发者使用。这种垫片本书就是无法完全实现的，所以我才需要从html层面作出封装与限制，因此我只会针对某些常见的场景进行针对性封装。满足80%的使用需求。
   1. `<appn-page>` 是一个视图容器，是作为导航的目标单元，它的底层是使用`<div inert=${this.open}>`，因此可以控制页面关闭的时候，使其子元素完全陷入对用户不可用、对辅助工作不可见的状态。
   1. 比如说我可以这样设计 `<appn-page pathname="/books/:id">`，利用URLPattern的匹配能力，来匹配当前路由。
   1. `<appn-page>` 作为导航的目标单元，还能有各种渲染的方式，比如以弹窗的方式渲染、以bottom-sheet的方式渲染。
   1. `<appn-page>` 与 `<appn-navigation-provider>` 配合，能实现页面之间的切换，跳转等等。
   1. `<appn-link>` 目前设想上就相对简单，主要就是一个 a 元素或者 button 元素的样式，使用 `AppNavigation` 来进行跳转
      1. `<appn-link>`的定位其实类似于`<a>`，但是它不大一样，`<a>`标签的href是基于当前的document.baseURI。而因此`<appn-page>`有自己的路径，因此`<appn-link>`能够读取`<appn-page>`的url来作为baseURI.
      1. 也就是说如果使用`<a>`，开发者需要自己去拼接完整的url，而`<appn-link>`则可以正确使用相对路径，会更符合开发直觉。
      1. 我有考虑这样设计: `<a is="appn-link">`/`<button is="appn-link">`，但是safari不支持对内置元素的扩展。

1. **`@appn-labs/fuse`** webapp的开发中，ux是非常重要的一部分，如何构建良好的页面互操作性重来都是一个巨大的挑战。我尝试使用html替代了js+html+css在交互上的表达。一方面因为css存在兼容性问题，同时css的target有限，只有`:hover`等简单的能力，而缺乏“有状态”的交互能力。因此有了这个项目，因为html元素本事就是有状态的，可操作的，有记忆的，因此基于html实现ux的声明式开发，是一种探索。

   > 这里我参考了fuseopen这套框架的设计。

   > 这部分的设计是相对激进的，至少我没有看到过世面上有类似的web-library，所以这部分作为实验性的部分独立出来。但宗旨仍然是一致的，就是服务于更好的WebApp的开发。

   > 其实它也启发与`htmx`这个库的哲学，只不过`htmx`毕竟是基于html属性，并不是标准，而`@appn-labs/fuse`是基于WebComponent，有原生的生命周期的支持。

   > `@appn-labs/fuse`的目的是满足常见的ux需求，正如我们会使用css实现一些简单的交互。一些复杂的交互仍然需要js参与。

   1. Gestures

   ```html
   <fuse-interactive-transform id="image-trans">
     <img src="" />
   </fuse-interactive-transform>
   <!-- 声明一些手势操作 -->
   <fuse-zoom-gesture target="ImageTrans" />
   <fuse-pan-gesture target="ImageTrans" />
   <fuse-rotate-gesture target="ImageTrans" />
   ```

   1. Animators

   ```html
   <div id="panel1">
     panel1
     <!-- 与 parentElement 绑定 pressed 手势 -->
     <fuse-while-pressed>
       <!-- 这里的 panel2.color 会被解析成: 查找 id=panel2 的元素，操作它的 color 样式 -->
       <!-- 当然这里不是直接操作，而是最终都会尽可能翻译成css代码或者js-animation-api代码来驱动 -->
       <fuse-change target="panel2.color" to="#0f0" duration="1s" />
       <!-- 这些html标签会整合出animation-api适用的配置 -->
       <fuse-move x="100px" delay="1s" duration="1s" />
     </fuse-while-pressed>
   </div>
   <div id="panel2">panel2</div>
   ```

   1. Timeline

   ```html
   <div id="rect">Rectangle</div>

   <fuse-timeline id="timeline">
     <fuse-change target="rect.opacity">
       <fuse-keyframe value="1" time="0.5s" />
       <fuse-keyframe value="0" time="1.0s" />
     </fuse-change>
   </fuse-timeline>

   <button>
     to start
     <fuse-clicked>
       <!-- set指令是js行为，与change不一样，change会编译成css代码；而set可以用来操作html-attribute或者html-property -->
       <fuse-set target="timeline.progress" to="0" />
     </fuse-clicked>
   </button>
   <button>
     to end
     <fuse-clicked>
       <fuse-set target="timeline.progress" to="1" />
     </fuse-clicked>
   </button>
   ```

   1. StateGroup

   ```html
   <div id="thePanel">
     <fuse-state-group id="panelState">
       <fuse-state name="redState">
         <fuse-change target="thePanel.backgroundColor" to="#f00" duration="0.2" />
       </fuse-state>
       <fuse-state name="greenState">
         <fuse-change target="thePanel.backgroundColor" to="#0f0" duration="0.2" />
       </fuse-state>
       <fuse-state name="blueState">
         <fuse-change target="thePanel.backgroundColor" to="#00f" duration="0.2" />
       </fuse-state>
     </state-group>

     <button>
       to Red
       <fuse-clicked>
         <fuse-set target="stateGroup.active" to="redState" />
       </fuse-clicked>
     </button>
     <button>
       to Green
       <fuse-clicked>
         <fuse-set target="stateGroup.active" to="greenState" />
       </fuse-clicked>
     </button>
     <button>
       to Blue
       <fuse-clicked>
         <fuse-set target="stateGroup.active" to="blueState" />
       </fuse-clicked>
     </button>
   </div>
   ```

   1. Busy(与Promise对象的联动)

   ```html
   <appn-page id="page1">
     <fuse-while-busy>
       <span>Loading...</span>
     </fuse-while-busy>
     <fuse-busy is-active="false" id="busy" />
     <script>
       async function startLoad() {
         busy.activate();
         try {
           const response = await fetch('http://example.com/some/data');
           //use the response
         } finally {
           busy.deactivate();
         }
       }
     </script>
     <!-- 监听appn-page的页面生命周期 -->
     <!-- 等价于 `<appn-page onactivated="busy.intercept(startLoad())">` -->
     <fuse-listener target="page1" eventname="activated" onemit="busy.intercept(startLoad())" />
   </appn-page>
   ```

1. 然后是页面的滚动上，我也将参考现有的滚动驱动的动画等高级CSS特性，提供web-component的封装，以满足80%的使用场景，同时确保兼容性。

   > 关于我使用HTML重新实现CSS Scroll-driven Animations，本质上并不是重新实现，而是“封装”，在原生支持的情况下，它仍然会被转化成CSS，否则将会自动启用Js垫片的支持。
   > 我当然可以使用javascript来直接实现。但选择html，是有几个好处：首先是因为它也是声明式的。其次它可以和我的声明式的控制器一起联动。
   > 因为我一直想探索将UX的部分直接在HTML上实现，否则目前的web开发，大部分都依赖js。你看react-motion它也是声明式的，但它基于jsx，所以还是在js上做声明，我想尝试直接在html上做声明，这样能覆盖到更大范围的使用场景。

   1. Scroll State

   ```html
   <appn-header id="header">
     <fuse-scroll-state stuck="top">
       <fuse-change target="header.borderBottom" to="1px solid #fff" duration="1s" />
     </fuse-scroll-state>
   </appn-header>
   <appn-footer id="footer">
     <fuse-scroll-state stuck="bottom">
       <fuse-change target="footer.topBottom" to="1px solid #fff" duration="1s" />
     </fuse-scroll-state>
   </appn-footer>
   ```

   1. Scroll Animation

   ```html
    <appn-scroll-view>
        <div id="progressBar">
        <fuse-timeline id="timeline">
          <fuse-change target="progressBar.scaleX">
            <fuse-keyframe value="0" time="0.5s" />
            <fuse-keyframe value="1" time="1.0s" />
          </fuse-change>
        </fuse-timeline>
        <scroll-timeline target="timeline" scroller="root" axis="block">
    </appn-scroll-view>
   ```

1. 最后是页面的切换上，我也需要将ViewTransaction进行一定的封装。这方面我对ViewTransaction的提案并没有完全了解，我只知道ViewTransaction的基本使用，因此还需要你帮忙给一些研发计划、组件设计、思路。

---

现在，假设你是一位W3C的标准制定者，对HTML标准非常熟悉，了解它的好的部分、不好的部分、以及相关的最佳实践。
同时你对社区中的其它WebComponentLibrary一直保持关注。同时你对社区中的相关提案也一直保持关注。
现在请你对这个框架做出中肯的直接的客观的评价。

如果你的评价是消极的，那么请你给出详细的说明，并告知我（框架的开发者）最佳实践是什么。
如果你的评价是积极的，那么请假设你要参与到框架的设计与开发中，为框架做出详细的设计，你特别需要关注几点：

1. signal-pure-html-file 如何使用它实现一个 multi-page-link-web-app
   > 注意这里的pure是指开发者使用纯html，而不是说禁用了js，毕竟webcomponent通常需要js才能工作
1. signal-page-app 模式下，也就是一个html文件配合着js文件，如何用它实现一些页面的动态加载
1. 这个框架如何与其它框架集成开发，比如react、vue、angular，如何替代react-router、vue-router、angualr-router 等等。
1. 当下，这个矿机可能专注于 spa，但对于 multi-page-app 模式，仍然要做出一些前期的设想。预留好升级的空间。因此也需要有一定的设计。
