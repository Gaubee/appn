import {map_get_or_put, type PromiseMaybe} from '@gaubee/util';
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
export const useAppnRoute = (loader: RouteLoader) =>
  ((ele) => {
    const loadChildren = map_get_or_put(childrenBuilder, loader, () => async () => {
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
    });
    const render = async (event: AppnRouteActivatedEvent) => {
      const navHistoryEntryNode = event.detail.navHistoryEntryNode;
      // map_delete_and_get(installedAppnRouteActivated, navHistoryEntryNode)?.unmount();
      const root = map_get_or_put(installedAppnRouteActivated, navHistoryEntryNode, () => {
        const root = createRoot(navHistoryEntryNode);
        return root;
      });

      // root.render(loadChildren());
      root.render(loadChildren());
      // root.unmount();
      // root.render(
      //   (() => {
      //     const [isPending, startTransition] = useTransition();
      //     const [content, setContent] = useState<React.ReactNode>(null);
      //     startTransition(async () => {
      //       if (!React.isValidElement(children)) {
      //         const loadChildren = await children();
      //         if (React.isValidElement(loadChildren)) {
      //           children = loadChildren;
      //         } else if (typeof loadChildren === 'function') {
      //           children = loadChildren();
      //         } else if ('default' in loadChildren) {
      //           children = loadChildren.default();
      //         } else {
      //           throw new Error('unknown children type');
      //         }
      //       }
      //       setContent(children);
      //     });
      //     return isPending ? <dialog open>Loading...</dialog> : content;
      //   })(),
      // );
    };
    const onAppnRouteactivated = ((event: AppnRouteActivatedEvent) => {
      console.log(event.detail.navEntry.index, event.detail.navHistoryEntryNode);
      render(event);
    }) as EventListenerOrEventListenerObject;
    ele?.addEventListener('appnrouteactivated', onAppnRouteactivated);
    return () => {
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
