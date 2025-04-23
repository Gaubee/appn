import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {appnNavigationBarStyle} from './appn-nav-bar.css';

// const APPN_NAVIGATION_BAR_POSITION_ENUM_VALUES = ['bottom','top', ] as const;
// export type AppnNavigationBarPosition = (typeof APPN_NAVIGATION_BAR_POSITION_ENUM_VALUES)[number];
@customElement('appn-nav-bar')
export class AppnNavigationBarElement extends LitElement {
  static override styles = appnNavigationBarStyle;

  /**
   * 关联到路由的state的某个字段上
   */
  @property({type: String, reflect: true, attribute: 'binding-state'})
  accessor bindingState: String = '';

  override render() {
    return html`
      <slot></slot>
      <div class="indicator" part="indicator"></div>
    `;
  }
}
