import {uncurryThisFn} from '@gaubee/util';

export const abort_throw_if_aborted = uncurryThisFn<AbortSignal, [], void>(
  (AbortSignal.prototype.throwIfAborted ??= function (this: AbortSignal) {
    if (this.aborted) {
      throw this.reason;
    }
  }),
);
