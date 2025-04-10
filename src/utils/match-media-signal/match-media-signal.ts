import {map_get_or_put, obj_props} from '@gaubee/util';
import {Signal, state_combine} from '../signals';

const matchMediaStateMap = /*@__PURE__*/ new Map<string, Signal.State<boolean>>();
/*@__NO_SIDE_EFFECTS__*/
export const matchMediaSignalify = (query: string) =>
  map_get_or_put(matchMediaStateMap, query, () => {
    const mediaQueryList = matchMedia(query);

    const state = new Signal.State(mediaQueryList.matches);

    // 添加监听（现代浏览器）
    mediaQueryList.addEventListener('change', (e) => {
      state.set(e.matches);
    });

    return state;
  });

/*@__NO_SIDE_EFFECTS__*/
export const multiMatchMediaSignalify = <Q extends Record<string, string>, R>(querys: Q, map: (matchs: {[key in keyof Q]: boolean}) => R) => {
  const states = {} as {[key in keyof Q]: Signal.State<boolean>};
  for (const key of obj_props(querys)) {
    states[key] = matchMediaSignalify(querys[key]);
  }

  // 合并
  const state = state_combine(states, map);

  return state;
};
