import {type DBSchema, openDB} from 'idb';
import {MinNavigationHistoryEntry, type MinNavigationEntryInit} from './navigation-history-entry';
import { func_remember } from '@gaubee/util';
import { uuid_reg } from '../../utils/uuid-helper';
interface AppnNavigationDB extends DBSchema {
  entries: {
    key: string;
    value: MinNavigationEntryInit;
    indexes: {sessionKey: string};
  };
}
const navDb = await openDB<AppnNavigationDB>('appn-navigation', 1, {
  upgrade(db) {
    const productStore = db.createObjectStore('entries', {
      keyPath: 'key',
    });
    productStore.createIndex('sessionKey', 'sessionKey');
  },
});
const session_key_token = '--appn-navigation-session-key--';

export const sessionKey = history.state?.sessionKey ?? sessionStorage.getItem(session_key_token) ?? crypto.randomUUID();
sessionStorage.setItem(session_key_token, sessionKey);
export const getAllEntryInits = async () => {
  const tran = navDb.transaction('entries');
  const entriesStore = tran.objectStore('entries');
  const entries = await entriesStore.index('sessionKey').getAll(sessionKey);
  tran.commit();
  return entries.sort((a, b) => a.index - b.index);
};

export const updateEntryInit = async (entry: MinNavigationEntryInit) => {
  const tran = navDb.transaction('entries', 'readwrite');
  const entriesStore = tran.objectStore('entries');
  await entriesStore.put(entry);
  await tran.commit();
};

export const updateAllEntryInits = async (entries: MinNavigationEntryInit[]) => {
  const tran = navDb.transaction('entries', 'readwrite');
  const entriesStore = tran.objectStore('entries');
  await entriesStore.clear();
  for (const entry of entries) {
    await entriesStore.add(entry);
  }
  await tran.commit();
};
export const updateAllEntries = async (entries: MinNavigationHistoryEntry[]) => {
  return updateAllEntryInits(entries.map((entry) => entry.__getInit()));
};

export const addEntry = async (entry: MinNavigationEntryInit) => {
  const tran = navDb.transaction('entries', 'readwrite');
  const entriesStore = tran.objectStore('entries');
  await entriesStore.add(entry);
  await tran.commit();
};

/**
 * prepare navigation state
 */
export const getState = func_remember(async () => {
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