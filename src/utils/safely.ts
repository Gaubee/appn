// import {accessor} from '@gaubee/util';

// export interface SafeConverter<T, C = unknown> {
//   /**
//    * 当通过 JavaScript property 设置值时调用。
//    * 尝试将输入值转换为有效的枚举成员 T。
//    * @param value - 尝试设置的任意值。
//    * @returns T - 有效的枚举成员。如果输入无效，则返回默认值。
//    */
//   set: (this: C, value: unknown) => T;
//   get?: (this: C) => T;
// }

// export const safely = <C extends object, T>(converter: SafeConverter<T, C>) => {
//   return accessor<C, T>((_target, _context) => {
//     return {
//       init(value) {
//         return converter.set.call(this, value);
//       },
//       get: converter.get,
//       set: converter.set,
//     };
//   });
// };
