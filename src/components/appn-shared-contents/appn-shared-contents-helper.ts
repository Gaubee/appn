import type {CommonSharedAbleContentsElement, CommonSharedElementSnap} from './appn-shared-contents-types';

export const staticElementSharedAbleContentsStyle = (element: CommonSharedAbleContentsElement): CommonSharedElementSnap => {
  return {
    element,
    fromBounding: element.getBoundingClientRect(),
    toTranslate(toSnap) {
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
      return `${eleDiffX + pageDiffX}px ${eleDiffY + pageDiffY}px`;
    },
  };
};

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
