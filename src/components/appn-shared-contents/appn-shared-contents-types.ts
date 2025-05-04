import type {Properties} from 'csstype';

export interface CommonSharedAbleContentsElement extends HTMLElement {
  sharedName: string | undefined | null;
  readonly sharedController: CommonSharedController;
}
export interface CommonSharedController {
  createSharedAnimation(...args: Parameters<HTMLElement['animate']>): Animation;
  getSharedSnap(): CommonSharedElementSnap;
}
export interface CommonSharedElementSnap {
  element: CommonSharedAbleContentsElement;
  fromBounding: DOMRect;
  toTranslate(toSnap: CommonSharedElementSnap, mode: CommonSharedAbleContentsMode): `${number}px ${number}px`; //{x: number; y: number};
  // toBounding: (fromBounding: DOMRect) => DOMRect;
  baseStyle?: Properties;
}
export type CommonSharedAbleContentsMode = 'new' | 'old' | 'shared';
