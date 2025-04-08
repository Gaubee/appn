# 兼容性报告

- ⚠️ > chrome 97+ / safari 17.0+
- ❌ > chrome 114+ / safari 17.5+

1. ⚠️ 🤖 [`color-mix()`](https://caniuse.com/mdn-css_types_color_color-mix)
   - 无垫片，有非一致性的回退方案，非致命
   - chrome 111+
   - safari 16.8+
1. ✅ [`System colors: AccentColor and AccentColorText`](https://caniuse.com/mdn-css_types_color_system-color_accentcolor_accentcolortext)
   - 有垫片，非致命
   - chrome#enable-experimental-web-platform-features 115+
   - safari 16.5+
1. ✅ [`scrollbar-width:none`](https://caniuse.com/mdn-css_properties_scrollbar-width)
   - 有垫片，非致命
   - chrome 121+
   - safari 18.2+
1. ✅ [`overflow:clip`](https://caniuse.com/css-overflow)
   - 无垫片
   - chrome 90+
   - safari 16.0+
1. ✅ [`scrollend event`](https://caniuse.com/mdn-api_element_scrollend_event)
   - 有垫片
   - chrome 114+
   - safari 未支持
1. ⚠️ 🤖 [`popover`](https://caniuse.com/mdn-api_htmlelement_popover)
   - 无垫片
   - chrome 114+
   - safari 17.0+
1. ⚠️ 🤖 ❌ 🍎 [`Navigation API`](https://caniuse.com/mdn-api_navigation)
   - 有垫片，但是该垫片对 Safari 的支持并不友好，且具有致命性BUG，未来将开发自己的垫片方案
   - chrome 102+
   - safari 未支持
1. ✅ [`URLPattern API`](https://caniuse.com/mdn-api_urlpattern)
   - 有垫片
   - chrome 95+
   - safari 未支持
1. ❌ 🤖 ❌ 🍎 [`anchor-name`](https://caniuse.com/mdn-css_properties_anchor-name) & [`position-anchor`](https://caniuse.com/mdn-css_properties_position-anchor)
   - 无垫片
   - chrome 125+
   - safari 未支持
1. ⚠️ 🤖 [`CSS Container Queries (Size)`](https://caniuse.com/css-container-queries)
   - 无垫片
   - chrome 106+
   - safari 16.0+
1. ⚠️ 🤖 🍎 [`CSS at-rule: @starting-style`](https://caniuse.com/mdn-css_at-rules_starting-style)
   - 无垫片
   - chrome 117+
   - safari 17.5+
1. ⚠️ 🍎 ❌ 🍎 [`View Transitions API (single-document)`](https://caniuse.com/view-transitions)
   - 无垫片
   - chrome 111+
   - safari 18.0+
1. ⚠️ 🤖 [`CSS at-rule: @layer`](https://caniuse.com/mdn-css_at-rules_layer)
   - 无垫片
   - chrome 99+
   - safari 15.4+
1. ⚠️ 🤖 [`:has() CSS relational pseudo-class`](https://caniuse.com/css-has)
   - 无垫片
   - chrome 105+
   - chrome 15.4+
