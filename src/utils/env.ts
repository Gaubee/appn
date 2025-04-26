import {func_remember, iter_map_not_null} from '@gaubee/util';

export const getFlags = func_remember(() => {
  const flags = new Set<string>();
  const parse = (config: string | null | undefined) => {
    if (config == null) {
      return;
    }
    const keys = iter_map_not_null(config.split(/[,\s]+/), (v) => (v ? v : null));
    for (const key of keys) {
      if (key.startsWith('-')) {
        flags.delete(key.slice(1));
      } else {
        flags.add(key);
      }
    }
  };
  parse(localStorage.getItem('--appn-flags--'));
  parse(new URLSearchParams(location.search).get('appn-flags'));
  return flags;
});
