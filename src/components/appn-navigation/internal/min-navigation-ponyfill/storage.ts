import {delay, timmers} from '@gaubee/util';
import {type DBSchema, openDB} from 'idb';
import type {MinNavigationEntryInit, MinNavigationHistoryEntry} from './navigation-history-entry';
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
export const enable_token = '--appn-navigation-reload--';
if (sessionStorage.getItem(enable_token) == enable_token) {
  console.log('QAQ start history.state', history.state);
  while (history.state?.sessionKey == null) {
    history.back();
    const event = await delay(timmers.eventTarget<PopStateEvent>(window, 'popstate'));
    console.log('QAQ back history.state', history.state, event);
  }
}
export const sessionKey = history.state?.sessionKey ?? crypto.randomUUID();

export const getAllEntryInits = async () => {
  const tran = navDb.transaction('entries');
  const entriesStore = tran.objectStore('entries');
  const entries = await entriesStore.index('sessionKey').getAll(sessionKey);
  tran.commit();
  return entries.sort((a, b) => a.index - b.index);
};
export const getCurrentEntry = (): string | undefined => {
  return history.state?.id;
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
