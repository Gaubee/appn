import type {Properties} from 'csstype';

export interface CommonSharedAbleContentsElement extends HTMLElement {
  sharedName: string | undefined | null;
  sharedOldStyle: string | undefined | null;
  sharedNewStyle: string | undefined | null;
  createSharedAnimation(...args: Parameters<HTMLElement['animate']>): Animation;
  getSharedStyle(): CommonSharedAbleContentsStyle;
}
export interface CommonSharedAbleContentsStyle {
  boudingRect: DOMRect;
  baseStyle?: Properties;
}
