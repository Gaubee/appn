import {MinNavigation} from './navigation';
import {getState} from './storage';

export * from '../navigation.native/types';
export * from './navigate-event';
export * from './navigation';
export * from './navigation-current-entry-change-event';
export * from './navigation-destination';
export * from './navigation-history-entry';
export * from './navigation-transition';

export const navigation = new MinNavigation(await getState());

Object.assign(globalThis, {
  minNavigation: navigation,
  MinNavigation: MinNavigation,
});
