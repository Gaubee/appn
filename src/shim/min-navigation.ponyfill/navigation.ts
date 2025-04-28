import {func_remember} from '@gaubee/util';
import {match, P} from 'ts-pattern';
import type {NavigationBase} from '../navigation.native/types';
import {promise_with_resolvers} from '../promise-with-resolvers.polyfill';
import {MinNavigateEvent} from './navigate-event';
import {MinNavigationCurrentEntryChangeEvent} from './navigation-current-entry-change-event';
import {MinNavigationDestination} from './navigation-destination';
import {MinNavigationHistoryEntry, type MinNavigationEntryInit} from './navigation-history-entry';
import {MinNavigationTransition} from './navigation-transition';
import {addEntry, getAllEntryInits, sessionKey, updateAllEntries, updateAllEntryInits, updateEntryInit} from './storage';

//#region prepare navigation state
const uuid_reg = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const getState = func_remember(async () => {
  const entryInits = await getAllEntryInits();
  let entries = entryInits.map((init) => new MinNavigationHistoryEntry(init));
  const currentEntryInitId = history.state?.id as string;
  let currentEntry = currentEntryInitId && uuid_reg.test(currentEntryInitId) ? entries.find((entry) => entry.id === currentEntryInitId) : void 0;
  if (!currentEntry) {
    const currentEntryInit: MinNavigationEntryInit = {
      id: crypto.randomUUID(),
      index: 0,
      key: crypto.randomUUID(),
      url: location.href,
      state: undefined,
      sessionKey: sessionKey,
    };
    currentEntry = new MinNavigationHistoryEntry(currentEntryInit);
    entries = [currentEntry];

    /// 初始化模式，绑定到 history.state 中，更新到数据库中
    history.replaceState(currentEntryInit, '', currentEntryInit.url);
    void updateAllEntryInits([currentEntryInit]);
  }

  return {
    entries,
    currentEntry,
  };
});
//#endregion

//#region navigation-api

export class MinNavigation extends EventTarget implements NavigationBase {
  readonly #state;
  constructor(state: Awaited<ReturnType<typeof getState>>) {
    super();
    this.#state = state;
    self.addEventListener('popstate', async (event) => {
      console.log('QAQ popstate', event.state);
      match(event.state)
        .with(
          {
            id: P.string.regex(uuid_reg),
            index: P.number.gte(0),
            key: P.string.regex(uuid_reg),
            url: P.string.startsWith(location.origin),
            state: P.any,
            sessionKey: P.string.regex(uuid_reg),
          },
          (toEntryInit) => {
            if (toEntryInit.id === state.currentEntry.id) {
              console.log('QAQ popstate', 'traverseTo ignore');
              return;
            }
            console.log('QAQ popstate', 'traverseTo start');
            this.traverseTo(toEntryInit.key, {info: event});
          }
        )
        .otherwise(() => {});
    });
  }
  entries(): NavigationHistoryEntry[] {
    return this.#state.entries;
  }
  get currentEntry(): NavigationHistoryEntry | null {
    return this.#state.currentEntry;
  }
  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): void {
    const currentEntry = this.#state.currentEntry;

    // 绑定到 history.state 中
    history.replaceState(
      {
        ...currentEntry.__getInit(),
        state: options.state,
      },
      '',
      location.href
    );
    const newEntryInit = history.state as MinNavigationEntryInit;
    // 如果成功，再绑定到 currentEntryInit 中
    currentEntry.__setInit(newEntryInit);
    // 最终再更新到数据库中
    void updateEntryInit(newEntryInit);
  }
  #transition: MinNavigationTransition | null = null;
  get transition(): NavigationTransition | null {
    return this.#transition;
  }
  get canGoBack() {
    const {currentEntry} = this;
    const entries = this.entries();
    if (!currentEntry || entries.length === 0) {
      return false;
    }
    return currentEntry.index > entries.at(0)!.index;
  }
  get canGoForward() {
    const {currentEntry} = this;
    const entries = this.entries();
    if (!currentEntry || entries.length === 0) {
      return false;
    }
    return currentEntry.index < entries.at(-1)!.index;
  }
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult {
    const safe_url = new URL(url, document.baseURI);
    const safe_href = safe_url.href;

    const navigationType = match(options?.history)
      .with('push', 'replace', (v) => v)
      .otherwise(() => (safe_href === location.href ? 'replace' : 'push')) satisfies NavigationType;

    const results = new MinNavigationResults();

    const fromEntry = this.#state.currentEntry;
    const fromEntryIndex = fromEntry.index;

    const toEntryInit: MinNavigationEntryInit = {
      id: crypto.randomUUID(),
      index: match(navigationType)
        .with('push', () => fromEntryIndex + 1)
        .with('replace', () => fromEntryIndex)
        .exhaustive(),
      key: crypto.randomUUID(),
      url: safe_href,
      state: options?.state,
      sessionKey: sessionKey,
    };
    MinNavigation.#applyNavigate(this, results, fromEntry, toEntryInit, navigationType, options?.info);

    return results.result;
  }
  reload(options?: NavigationReloadOptions): NavigationResult {
    const navigationType = 'reload' satisfies NavigationType;
    const results = new MinNavigationResults();
    const fromEntry = this.#state.currentEntry;

    const toEntryOrInit =
      /// 如果 state === undefined，那么就不走更新
      options?.state === undefined
        ? fromEntry
        : // 否则即便是 null 对象，也会被更新
          {...fromEntry.__getInit(), state: options?.state};
    MinNavigation.#applyNavigate(this, results, fromEntry, toEntryOrInit, navigationType, options?.info);

    return results.result;
  }
  traverseTo(key: string, options?: NavigationOptions): NavigationResult {
    const toEntry = this.#state.entries.find((entry) => entry.key === key);
    const results = new MinNavigationResults();
    if (toEntry === this.currentEntry) {
      results.committer.resolve(toEntry);
      results.finisher.resolve(toEntry);
    } else if (!toEntry) {
      results.abort.abort(new DOMException('Invalid key', 'InvalidStateError'));
    } else {
      const navigationType = 'traverse' satisfies NavigationType;
      const fromEntry = this.#state.currentEntry;
      MinNavigation.#applyNavigate(this, results, fromEntry, toEntry, navigationType, options?.info);
    }
    return results.result;
  }
  back(options?: NavigationOptions): NavigationResult {
    const navigationType = 'traverse' satisfies NavigationType;

    const results = new MinNavigationResults();

    const fromEntry = this.#state.currentEntry;
    const entries = this.#state.entries;

    const toEntry = entries[entries.indexOf(fromEntry) - 1];
    if (!toEntry) {
      results.abort.abort(new DOMException('Cannot go back', 'InvalidStateError'));
    } else {
      MinNavigation.#applyNavigate(this, results, fromEntry, toEntry, navigationType, options?.info);
    }

    return results.result;
  }
  forward(_options?: NavigationOptions): NavigationResult {
    throw new Error('Method not implemented.');
  }

  //#region applyNavigate
  static #applyNavigate(
    navApi: MinNavigation,
    results: MinNavigationResults,
    fromEntry: MinNavigationHistoryEntry,
    toEntryOrInit: MinNavigationHistoryEntry | MinNavigationEntryInit,
    navigationType: NavigationType,
    info: unknown
  ) {
    let toEntryInit: MinNavigationEntryInit;
    let _toEntry: MinNavigationHistoryEntry | undefined;
    if (toEntryOrInit instanceof MinNavigationHistoryEntry) {
      _toEntry = toEntryOrInit;
      toEntryInit = toEntryOrInit.__getInit();
    } else {
      toEntryInit = toEntryOrInit;
    }
    const event = new MinNavigateEvent({
      navigationType: navigationType,
      canIntercept: true,
      hashChange: new URL(toEntryInit.url).hash !== new URL(fromEntry.url).hash,
      destination: new MinNavigationDestination(toEntryInit),
      signal: results.abort.signal,
      formData: null,
      downloadRequest: null,
      info: info,
    });

    /// 触发事件
    const success = navApi.dispatchEvent(event);

    /// 如果没有被被取消，那么意味着路由直接发生改变
    if (success) {
      const toEntry = _toEntry ?? new MinNavigationHistoryEntry(toEntryInit);
      navApi.#state.currentEntry = toEntry;
      const entries = navApi.#state.entries;
      results.committer.resolve(toEntry);
      match(navigationType)
        .with('push', () => {
          history.pushState(toEntryInit, '', toEntryInit.url || location.href);

          const afterFromIndex = entries.indexOf(fromEntry) + 1;
          if (afterFromIndex === 0) {
            entries.length = 0;
            entries.push(toEntry);
            void updateAllEntries(entries);
          } else if (afterFromIndex === entries.length) {
            entries.push(toEntry);
            void addEntry(toEntryInit);
          } else {
            entries.splice(afterFromIndex, entries.length - afterFromIndex, toEntry);
            void updateAllEntries(entries);
          }
        })
        .with('replace', () => {
          history.replaceState(toEntryInit, '', toEntryInit.url || location.href);

          const fromIndex = entries.indexOf(fromEntry);
          if (fromIndex === -1) {
            entries.length = 0;
            entries.push(toEntry);
            void updateAllEntries(entries);
          } else {
            entries[fromIndex] = toEntry;
            void updateEntryInit(toEntryInit);
          }
        })
        .with('traverse', () => {
          if (info instanceof PopStateEvent) {
            // from popstateevent ignore history-go
          } else {
            history.go(toEntryInit.index - fromEntry.index);
          }
          updateEntryInit(toEntryInit);
        })
        .with('reload', async () => {
          if (toEntry.getState() !== fromEntry.getState()) {
            await updateEntryInit(toEntryInit);
          }
          location.reload();
        })
        .exhaustive();
      navApi.dispatchEvent(
        new MinNavigationCurrentEntryChangeEvent({
          navigationType,
          from: fromEntry,
        })
      );
      (async () => {
        try {
          navApi.#transition = new MinNavigationTransition({
            navigationType,
            from: fromEntry,
            finished: results.finisher.promise.then(() => {}),
          });
          await event.__runHandler();
          results.finisher.resolve(toEntry);
        } catch (err) {
          results.finisher.reject(err);
        }
        navApi.#transition = null;
      })();
    } else {
      /// 如果被取消，那么抛出错误
      const error = new DOMException('Navigation was aborted', 'AbortError');
      results.abort.abort(error);
    }
  }
  //#endregion
}
export const navigation = new MinNavigation(await getState());

Object.assign(globalThis, {
  minNavigation: navigation,
  MinNavigation: MinNavigation,
});

//#endregion

//#region  navigate-results

class MinNavigationResults {
  committer = promise_with_resolvers<MinNavigationHistoryEntry>();
  finisher = promise_with_resolvers<MinNavigationHistoryEntry>();
  abort = new AbortController();
  result = {committed: this.committer.promise, finished: this.finisher.promise};
  constructor() {
    const abort = this.abort;
    abort.signal.addEventListener('abort', () => {
      this.committer.reject(abort.signal.reason);
      this.finisher.reject(abort.signal.reason);
    });
  }
}
//#endregion
