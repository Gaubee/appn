import {css, html, ReactiveElement, type ReactiveController, type TemplateResult} from 'lit';
import {cache} from 'lit/directives/cache.js';
import type {CommonSharedAbleContentsElement, CommonSharedController, CommonSharedElementSnap} from './appn-shared-contents-types';

export const staticElementSharedAbleContentsStyle = (element: CommonSharedAbleContentsElement): CommonSharedElementSnap => {
  return {
    element,
    fromBounding: element.getBoundingClientRect(),
    toTranslate(toSnap, mode) {
      if (toSnap.element === element) {
        return `0px 0px`;
      }

      const fromPageBounding = element.closest('appn-page')!.getBoundingClientRect();
      const toPageBounding = toSnap.element.closest('appn-page')!.getBoundingClientRect();
      const pageDiffX = toPageBounding.left - fromPageBounding.left;
      const pageDiffY = toPageBounding.top - fromPageBounding.top;
      //   const fromBounding = mode === 'new' ? this.fromBounding : element.getBoundingClientRect();
      const fromBounding = this.fromBounding;
      const toBounding = toSnap.fromBounding;
      const eleDiffX = toBounding.left - fromBounding.left;
      const eleDiffY = toBounding.top - fromBounding.top;
      console.log('QAQ page', pageDiffX, pageDiffY);
      console.log('QAQ ele', eleDiffX, eleDiffY);
      if (mode === 'new') {
        return `${pageDiffX - eleDiffX}px ${eleDiffY + pageDiffY}px`;
      }
      return `${eleDiffX + pageDiffX}px ${eleDiffY + pageDiffY}px`;
    },
  };
};

export class StaticSharedController implements ReactiveController, CommonSharedController {
  constructor(private __host: ReactiveElement & CommonSharedAbleContentsElement) {
    this.__host.addController(this);
  }
  hostConnected(): void {}
  hostDisconnected(): void {}

  private accessor __sharedAnimation: Animation | null = null;

  createSharedAnimation(...args: Parameters<HTMLElement['animate']>) {
    let ani = this.__sharedAnimation;
    if (!ani) {
      ani = this.__host.animate(...args);
      this.__sharedAnimation = ani;
      ani.finished.finally(() => {
        this.__sharedAnimation = null;
      });
    }
    return ani;
  }
  getSharedSnap(): CommonSharedElementSnap {
    return fixedElementSharedAbleContentsStyle(this.__host);
  }
}

export const fixedElementSharedAbleContentsStyle = (element: CommonSharedAbleContentsElement): CommonSharedElementSnap => {
  return {
    element,
    fromBounding: element.getBoundingClientRect(),
    toTranslate(toSnap) {
      const toBounding = toSnap.fromBounding;
      return `${toBounding.left}px ${toBounding.top}px`;
    },
  };
};

export const fixedSharedInnerStyle = css`
  dialog.shared-layer {
    padding: 0;
    margin: 0;
    border: 0;

    position: static;
    color: inherit;
    background: transparent;
    isolation: isolate;
  }
  dialog.shared-layer::backdrop {
    display: none;
  }
`;
export const fixedSharedInner = (inner: TemplateResult) => html`<dialog open class="shared-layer">${inner}</dialog>`;

export class FixedSharedController implements ReactiveController, CommonSharedController {
  constructor(private __host: ReactiveElement & CommonSharedAbleContentsElement) {
    this.__host.addController(this);
  }
  private __dialogEle: HTMLDialogElement | null = null;
  hostUpdated(): void {
    this.__dialogEle = this.__host.shadowRoot!.querySelector('dialog.shared-layer');
  }
  hostDisconnected(): void {
    this.__dialogEle = null;
  }

  private __sharedAnimation: Animation | null = null;
  private __startBounding: DOMRect | null = null;
  get startBounding() {
    return this.__startBounding;
  }
  set startBounding(bounding) {
    this.__startBounding = bounding;
    this.__host.requestUpdate();
  }
  createSharedAnimation(...args: Parameters<HTMLElement['animate']>) {
    let ani = this.__sharedAnimation;
    if (!ani) {
      const dialogEle = this.__dialogEle;
      if (!dialogEle) {
        throw new Error('fixed element is null');
      }
      this.startBounding = dialogEle.getBoundingClientRect();
      dialogEle.close();
      dialogEle.showModal();
      ani = dialogEle.animate(...args);
      this.__sharedAnimation = ani;
      ani.finished.finally(() => {
        this.__sharedAnimation = null;
        this.startBounding = null;
        dialogEle.close();
        dialogEle.show();
      });
    }
    return ani;
  }
  getSharedSnap(): CommonSharedElementSnap {
    return {
      ...fixedElementSharedAbleContentsStyle(this.__host),
      baseStyle: {
        margin: 0,
        borderWidth: 0,
      },
    };
  }
  render(inner: unknown) {
    const startSize = this.startBounding;
    return html`${cache(
        startSize
          ? html`<style>
              :host {
                width: ${startSize.width}px;
                height: ${startSize.height}px;
              }
            </style>`
          : null,
      )}
      <dialog open class="shared-layer">${inner}</dialog>`;
  }
}
