import {ContextConsumer} from '@lit/context';
import {Task} from '@lit/task';
import type {ReactiveControllerHost} from 'lit';
import {appnNavigationContext, appnNavigationHistoryEntryContext} from '../appn-navigation/appn-navigation-context';
import {nav_before_history_entries} from '../appn-navigation/internal/appn-navigation-helper';

export const createPreNavs = (host: ReactiveControllerHost & HTMLElement) => {
  const navConsumer = new ContextConsumer(host, {context: appnNavigationContext});
  const navigationEntryConsumer = new ContextConsumer(host, {context: appnNavigationHistoryEntryContext, subscribe: true});

  const task = new Task(host, {
    task: ([nav, currentNavEntryId]) => {
      return nav_before_history_entries(nav, currentNavEntryId);
    },
    args: () => [navConsumer.value, navigationEntryConsumer.value?.id],
  });
  return {
    task,
    navConsumer,
    navigationEntryConsumer,
    get nav() {
      return navConsumer.value;
    },
    get navigationEntry() {
      return navigationEntryConsumer.value;
    }
  };
};
