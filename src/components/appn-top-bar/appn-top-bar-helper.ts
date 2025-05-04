const navigation_entry_page_title_wm = new WeakMap<NavigationHistoryEntry, string>();
export const get_navigation_entry_page_title = (entry: NavigationHistoryEntry | null | undefined) => {
  return entry ? navigation_entry_page_title_wm.get(entry) : undefined;
};
export const set_navigation_entry_page_title = (entry: NavigationHistoryEntry | null | undefined, page_title: string) => {
  if (entry) {
    navigation_entry_page_title_wm.set(entry, page_title);
  }
};
