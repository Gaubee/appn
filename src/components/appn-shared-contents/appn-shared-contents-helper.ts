import type {CommonSharedAbleContentsStyle} from './appn-shared-contents-types';

export const staticElementSharedAbleContentsStyle = (element: HTMLElement): Pick<CommonSharedAbleContentsStyle, 'fromBounding' | 'toBounding'> => {
  const selfFromBouding = element.getBoundingClientRect();
  return {
    fromBounding: new DOMRect(0, 0, selfFromBouding.width, selfFromBouding.height),
    toBounding(otherFromBounding) {
      return new DOMRect(
        // x, y, width, height
        otherFromBounding.x - selfFromBouding.x,
        otherFromBounding.y - selfFromBouding.y,
        selfFromBouding.width,
        selfFromBouding.height,
      );
    },
  };
};

export const fixedElementSharedAbleContentsStyle = (element: HTMLElement): Pick<CommonSharedAbleContentsStyle, 'fromBounding' | 'toBounding'> => {
  return {
    fromBounding: element.getBoundingClientRect(),
    toBounding() {
      return this.fromBounding;
    },
  };
};
