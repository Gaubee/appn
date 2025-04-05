import {Task} from '@lit/task';
import {html, LitElement, svg, type ElementPart} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {directive, Directive} from 'lit/directive.js';
import {match} from 'ts-pattern';
import {appnIconDefine, appnIconGet, appnIconSafeGet, appnIconWhenDefine} from './appn-icon-register';
import {appnIconStyle} from './appn-icon.css';
import './internal/buildin-ios-icon';

/**
 * @attr {string} name - The name of the icon to display.
 */
@customElement('appn-icon')
export class AppnIcon extends LitElement {
  static readonly define = appnIconDefine;
  static readonly get = appnIconGet;
  static readonly whenDefine = appnIconWhenDefine;
  static readonly safeGet = appnIconSafeGet;
  static override styles = appnIconStyle;

  @property({type: String, reflect: true, attribute: true})
  accessor name: string | null = null;

  private __icon = new Task(this, {
    task: ([name]) => {
      return appnIconSafeGet(name ?? '');
    },
    args: () => [this.name],
  });
  override render() {
    return this.__icon.render({
      complete: ({viewBox, layers}) => {
        return html`
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
    'appn-icon': AppnIcon;
  }
}
