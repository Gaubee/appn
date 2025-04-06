import {func_remember} from '@gaubee/util';
import {Task} from '@lit/task';
import {html, LitElement, svg, type ElementPart} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {directive, Directive} from 'lit/directive.js';
import {when} from 'lit/directives/when.js';
import {match} from 'ts-pattern';
import {enumToSafeConverter, safeProperty} from '../../utils/safe-property-converter';
import {appnIconDefine, appnIconGet, appnIconSafeGet, appnIconWhenDefine, styleToCss, type AppnIcon} from './appn-icon-register';
import {appnIconStyle} from './appn-icon.css';
import './internal/buildin-ios-icon';

const APPN_ICON_WIDGET_ENUM_VALUES = ['normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800, 900, 'bolder', 'lighter'] as const;
export type AppnIconWidget = (typeof APPN_ICON_WIDGET_ENUM_VALUES)[number];

/**
 * @attr {string} name - The name of the icon to display.
 * @attr {AppnIconWidget} widget - The widget of the icon to display.
 */
@customElement('appn-icon')
export class AppnIconElement extends LitElement {
  static readonly define = appnIconDefine;
  static readonly get = appnIconGet;
  static readonly whenDefine = appnIconWhenDefine;
  static readonly safeGet = appnIconSafeGet;
  static override styles = appnIconStyle;

  @property({type: String, reflect: true, attribute: true})
  accessor name: string | null = null;

  @safeProperty(enumToSafeConverter(APPN_ICON_WIDGET_ENUM_VALUES))
  accessor widget: AppnIconWidget = 'normal';

  private __icon = new Task(this, {
    task: ([name]) => {
      return appnIconSafeGet(name ?? '');
    },
    args: () => [this.name],
  });

  private __effect_widget = func_remember(
    (widget: AppnIconWidget) => {
      const fontWeight = match(widget)
        .with('bolder', 'lighter', (value) => {
          const oldFontWeight = this.style.fontWeight;
          try {
            this.style.fontWeight = value;
            return +getComputedStyle(this).fontWeight;
          } finally {
            this.style.fontWeight = oldFontWeight;
          }
        })
        .with('bold', () => 700)
        .with('normal', () => 400)
        .otherwise((v) => v);
      this.dataset.fontWeight = fontWeight.toString();
    },
    (widget) => widget
  );
  private __effect_icon_style = func_remember(
    (icon: AppnIcon) => {
      if (icon.variants) {
        const styleVariants = icon.variants.filter((v) => v.type === 'style'); //.map(v=>v.style);
        const cssText = styleVariants.map(({selector, style}) => `:host(${selector}){${styleToCss(style)}}`).join('\n');
        return cssText;
      }
      return;
    },
    (icon) => icon
  );
  override render() {
    this.__effect_widget(this.widget);

    return this.__icon.render({
      complete: (icon) => {
        const iconVariant = icon.variants?.find((variant) => variant.type === 'icon' && this.matches(variant.selector)) as AppnIcon.VariantIcon | undefined;
        const {viewBox, layers} = iconVariant ?? icon;

        const styleCssText = this.__effect_icon_style(icon);

        return html`
          ${when(
            styleCssText,
            () =>
              html`<style>
                ${styleCssText}
              </style>`
          )}
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}"
          >
            <g>
              ${layers.map((layer) => {
                return match(layer)
                  .with({type: 'path'}, (layer) => svg`<path ${spread(layer)}/>`)
                  .with({type: 'polyline'}, (layer) => svg`<polyline ${spread(layer)}/>`)
                  .with({type: 'rect'}, (layer) => svg`<rect ${spread(layer)}/>`)
                  .exhaustive();
              })}
            </g>
          </svg>
        `;
      },
    });
  }
}
class SpreadDirective extends Directive {
  override update(part: ElementPart, [props]: [Record<string, unknown>]) {
    const ele = part.element;
    for (const prop in props) {
      if (prop in ele) {
        (ele as any)[prop] = props[prop];
      } else {
        const attr = props[prop];
        if (attr != null) {
          ele.setAttribute(prop, String(attr));
        }
      }
    }
    return this.render(props);
  }
  override render(_props: object): unknown {
    return '';
  }
}

export const spread = directive(SpreadDirective);

declare global {
  interface HTMLElementTagNameMap {
    'appn-icon': AppnIconElement;
  }
}
