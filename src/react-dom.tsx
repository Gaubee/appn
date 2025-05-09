import {abort_signal_merge, abort_signal_race, func_remember, map_get_or_put, type PromiseMaybe} from '@gaubee/util';
import React, {type FC} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import type {AppnNavigationHistoryEntryElement, AppnRouteActivatedEvent} from './components/appn-navigation/appn-navigation';
import {AppnHeader, AppnNavBack, AppnNavBackText, AppnNavTitle, AppnTopBar} from './react';
const installedAppnRouteActivated = new WeakMap<AppnNavigationHistoryEntryElement, Root>();

type RouteLoader =
  | React.ReactElement
  //
  | (() => PromiseMaybe<React.ReactElement>)
  | (() => PromiseMaybe<() => React.ReactElement>)
  | (() => PromiseMaybe<{default: () => React.ReactElement}>);

const childrenBuilder = new WeakMap<RouteLoader, () => Promise<React.ReactElement>>();
const getLoadChildren = (loader: RouteLoader) => {
  const loadChildren = map_get_or_put(childrenBuilder, loader, () =>
    func_remember(async () => {
      let children: React.ReactElement;
      if (!React.isValidElement(loader)) {
        const loadChildren = await loader();
        if (React.isValidElement(loadChildren)) {
          children = loadChildren;
        } else if (typeof loadChildren === 'function') {
          children = loadChildren();
        } else if ('default' in loadChildren) {
          children = loadChildren.default();
        } else {
          throw new Error('unknown children type');
        }
      } else {
        children = loader;
      }
      return children;
    }),
  );
  return loadChildren;
};
export const useAppnRoute = (loader: RouteLoader) =>
  ((ele) => {
    const aborter = new AbortController();
    const onAppnRouteactivated = ((event: AppnRouteActivatedEvent) => {
      event.intercept({
        async handler() {
          const navHistoryEntryNode = event.navHistoryEntryNode;
          // map_delete_and_get(installedAppnRouteActivated, navHistoryEntryNode)?.unmount();
          const root = map_get_or_put(installedAppnRouteActivated, navHistoryEntryNode, () => {
            const root = createRoot(navHistoryEntryNode);
            return root;
          });
          const loadChildren = getLoadChildren(loader);

          const children = await abort_signal_race(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            abort_signal_merge(event.signal, aborter.signal)!,
            loadChildren(),
          );
          root.render(children);
        },
      });
    }) as EventListenerOrEventListenerObject;

    ele?.addEventListener('appnrouteactivated', onAppnRouteactivated);
    return () => {
      aborter.abort();
      ele?.removeEventListener('appnrouteactivated', onAppnRouteactivated);
    };
  }) as React.Ref<HTMLTemplateElement>;

export const AppnCommonTitleHeader: FC<{pageTitleClassName?: string; pageTitle: string}> = ({pageTitle, pageTitleClassName: titleClassName}) => {
  return (
    <AppnHeader>
      <AppnTopBar>
        <AppnNavBack slot="start">
          <AppnNavBackText></AppnNavBackText>
        </AppnNavBack>
        <AppnNavTitle className={titleClassName} pageTitle={pageTitle}></AppnNavTitle>
      </AppnTopBar>
    </AppnHeader>
  );
};

export const AppRoute: FC<{pathname?: string; search?: string; hash?: string; loader: RouteLoader}> = ({pathname, search, hash, loader}) => {
  return <template slot="router" data-pathname={pathname} data-hash={hash} data-search={search} data-route-mode="dynamic" ref={useAppnRoute(loader)}></template>;
};
