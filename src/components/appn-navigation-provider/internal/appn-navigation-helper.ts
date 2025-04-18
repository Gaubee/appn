import type {AppnNavigation} from '../appn-navigation-context';

/**
 * 向当前 state 中，写入一对 key-value 数组
 * 如果没有变更，不会触发写入
 */
export const nav_set_current_state_kv = (nav: AppnNavigation | null | undefined, key: string, value: unknown) => {
  if (nav == null) {
    return;
  }
  let state = nav.currentEntry?.getState();
  let needSet = true;
  try {
    if (state) {
      needSet = indexedDB.cmp((state as any)[key], value) !== 0;
    }
  } catch {}

  if (needSet) {
    state = {
      ...(state ?? {}),
      [key]: value,
    };
    nav.updateCurrentEntry({
      state,
    });
  }
};

export const nav_state_get_kv = <T = unknown>(navState: NavigationHistoryEntry | null | undefined, key: string): T | undefined => {
  if (navState == null) {
    return;
  }
  const state = navState.getState();
  try {
    if (state) {
      return (state as any)[key] as T;
    }
  } catch {}
  return;
};

export const nav_before_history_entries = async (nav: AppnNavigation | null | undefined, currentId = nav?.currentEntry?.id): Promise<NavigationHistoryEntry[] | undefined> => {
  if (nav == null || currentId == null) {
    return;
  }

  const allEntries = await nav.entries();
  const currentIndex = allEntries.findIndex((entry) => entry.id === currentId);
  if (currentIndex > 0) {
    return allEntries.slice(0, currentIndex);
  }
  return;
};
