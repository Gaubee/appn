import {obj_props} from '@gaubee/util';
import {css} from 'lit';
import {unstyledLightTheme} from './unstyled-theme';
//#region --font-*
// 定义字体相关的自定义属性及其描述符
const fontProperties = [
  // font-weight: 使用 <integer> 是正确的
  {name: '--font-weight', syntax: '<integer>', initialValue: '400'},
  // font-style: 接受关键字 normal, italic, oblique, oblique <angle>，但因为syntax-descriptor的限制，我们只能先使用 * 来替代
  {name: '--font-style', syntax: '*', initialValue: 'normal'},
  // 注意：虽然 'oblique <angle>' 也是有效的，但为了简单起见，如果只关心基本关键字，可以只写 'normal | italic | oblique'
  // font-variant-*: 这些属性接受关键字。使用 '*' 作为通用语法是最简单的方式，
  // 因为精确定义所有可能的组合比较复杂。如果你只需要特定的值，可以列出它们。
  {name: '--font-variant-ligatures', syntax: '*', initialValue: 'normal'},
  {name: '--font-variant-caps', syntax: '*', initialValue: 'normal'},
  {name: '--font-variant-numeric', syntax: '*', initialValue: 'normal'},
  {name: '--font-variant-east-asian', syntax: '*', initialValue: 'normal'},
  {name: '--font-variant-alternates', syntax: '*', initialValue: 'normal'},
  {name: '--font-variant-position', syntax: 'normal | sub | super', initialValue: 'normal'}, // 这个比较简单，可以列出
  {name: '--font-variant-emoji', syntax: 'normal | text | emoji | unicode', initialValue: 'normal'}, // 这个也比较简单
  // font-stretch: 接受关键字或 <percentage>
  {
    name: '--font-stretch',
    syntax: '<percentage> | ultra-condensed | extra-condensed | condensed | semi-condensed | normal | semi-expanded | expanded | extra-expanded | ultra-expanded',
    initialValue: 'normal',
  },
  // font-size: 接受 <length>, <percentage>, 或绝对/相对关键字
  {name: '--font-size', syntax: '<length> | <percentage> | large | medium | small | x-large | x-small | xx-large | xx-small | smaller | larger', initialValue: 'medium'},
  // font-family: 语法非常复杂（字符串列表或关键字），使用 '*' 是最实用的
  {name: '--font-family', syntax: '*', initialValue: 'sans-serif'},
  // font-optical-sizing: 原始定义是正确的
  {name: '--font-optical-sizing', syntax: 'auto | none', initialValue: 'auto'},
  // font-size-adjust: 原始定义是正确的
  {name: '--font-size-adjust', syntax: '<number> | none', initialValue: 'none'},
  // font-kerning: 接受关键字
  {name: '--font-kerning', syntax: 'auto | normal | none', initialValue: 'auto'},
  // font-feature-settings: 语法复杂（normal 或特性标签列表），使用 '*'
  {name: '--font-feature-settings', syntax: '*', initialValue: 'normal'},
  // font-variation-settings: 语法复杂（normal 或变量设置列表），使用 '*'
  {name: '--font-variation-settings', syntax: '*', initialValue: 'normal'},
  // line-height: 接受 normal, <number>, <length>, <percentage>
  // 需要在 syntax 中加入 'normal' 关键字，因为它是 initialValue
  {name: '--line-height', syntax: 'normal | <number> | <length> | <percentage>', initialValue: 'normal'},
];

for (const prop of fontProperties) {
  try {
    CSS.registerProperty({
      ...prop,
      inherits: true,
    });
  } catch (e) {
    debugger;
    console.error(e, prop);
  }
}
//#endregion

//#region --color-scheme-*
['dark', 'light'].forEach((colorScheme, initialValue) => {
  CSS.registerProperty({
    name: `--color-scheme-${colorScheme}`,
    syntax: '<number>', // 使用 number 而不是 integer，目的是有需要的话，可以进行动画。
    inherits: true,
    // light=1 dark=0
    initialValue: `${initialValue}`,
  });
});
//#endregion

//#region --color-*
for (const key of obj_props(unstyledLightTheme.colors)) {
  try {
    CSS.registerProperty({
      name: `--color-${key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-/, '')}`,
      syntax: '<color>',
      inherits: true,
      initialValue: unstyledLightTheme.colors[key],
    });
  } catch (e) {
    debugger;
    console.error(e, key, unstyledLightTheme.colors[key]);
  }
}
//#endregion

//#region --safe-area-inset-*
for (const pos of obj_props(unstyledLightTheme.safeAreaInset)) {
  CSS.registerProperty({
    name: `--safe-area-inset-${pos}`,
    syntax: '<length-percentage>',
    inherits: true,
    initialValue: '0px',
  });
}
//#endregion

//#region --grid-unit
CSS.registerProperty({
  name: '--grid-unit',
  syntax: '<length>',
  inherits: true,
  initialValue: unstyledLightTheme.gridUnit,
});
//#endregion

export const appnThemeStyles = [
  css`
    :host {
      display: contents;
    }
    ::slotted(*) {
      font-style: var(--font-style);
      font-variant-ligatures: var(--font-variant-ligatures);
      font-variant-caps: var(--font-variant-caps);
      font-variant-numeric: var(--font-variant-numeric);
      font-variant-east-asian: var(--font-variant-east-asian);
      font-variant-alternates: var(--font-variant-alternates);
      font-variant-position: var(--font-variant-position);
      font-variant-emoji: var(--font-variant-emoji);
      font-weight: var(--font-weight);
      font-stretch: var(--font-stretch);
      font-size: var(--font-size);
      font-family: var(--font-family);
      font-optical-sizing: var(--font-optical-sizing);
      font-size-adjust: var(--font-size-adjust);
      font-kerning: var(--font-kerning);
      font-feature-settings: var(--font-feature-settings);
      font-variation-settings: var(--font-variation-settings);
      line-height: var(--line-height);

      accent-color: var(--color-accent);
    }
    :host([data-color-scheme='light']) {
      --color-scheme-light: 1;
      --color-scheme-dark: 0;
    }
    :host([data-color-scheme='dark']) {
      --color-scheme-light: 0;
      --color-scheme-dark: 1;
    }
  `,
];
