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
