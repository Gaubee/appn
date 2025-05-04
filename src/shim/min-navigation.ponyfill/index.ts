export * from './navigate-event';
export * from './navigation';
export * from './navigation-current-entry-change-event';
export * from './navigation-destination';
export * from './navigation-history-entry';
export * from './navigation-transition';

import {MinNavigation} from './navigation';
import {getState} from './storage';

export const minNavigation = new MinNavigation(await getState());

Object.assign(globalThis, {
  minNavigation,
  MinNavigation,
});
