import {func_remember} from '@gaubee/util';
import {state_map} from '../signals';
import {matchMediaSignalify} from './match-media-signal';

export const colorSchemeStateify = func_remember(() => {
  const isDarkState = matchMediaSignalify('(prefers-color-scheme: dark)');

  return state_map(isDarkState, (isDark) => (isDark ? ('dark' as const) : ('light' as const)));
});
