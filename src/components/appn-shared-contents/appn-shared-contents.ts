import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {sharedElements} from '../../shim/shared-element.native';
import {FixedSharedController} from './appn-shared-contents-helper';
import type {CommonSharedAbleContentsElement} from './appn-shared-contents-types';
import {appnSharedStyle} from './appn-shared-contents.css';

@customElement('appn-shared-contents')
export class AppnSharedContentsElement extends LitElement implements CommonSharedAbleContentsElement {
  static override styles = appnSharedStyle;

  @property({type: String, reflect: true, attribute: true})
  accessor sharedName!: string;

  @property({type: String, reflect: true, attribute: true})
  accessor sharedOldStyle!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor sharedNewStyle!: string;

  readonly sharedController: FixedSharedController = new FixedSharedController(this);

  override render() {
    sharedElements.set(this, this.sharedName, {
      old: this.sharedOldStyle,
      new: this.sharedNewStyle,
    });
    return this.sharedController.render(html`<slot></slot>`);
  }
}
