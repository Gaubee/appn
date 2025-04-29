console.log(0);
import {MinNavigation} from './navigation';
import {getState} from './storage';

export * from '../navigation.native/types';
export * from './navigate-event';
export * from './navigation';
export * from './navigation-current-entry-change-event';
export * from './navigation-destination';
export * from './navigation-history-entry';
export * from './navigation-transition';
console.log(111);
export const minNavigation = new MinNavigation(await getState());
console.log(222);

Object.assign(globalThis, {
  minNavigation,
  MinNavigation,
});
