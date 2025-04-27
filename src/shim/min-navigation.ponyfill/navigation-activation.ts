/**
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/NavigationActivation)
 * > 理论上不需要实现该功能，如果有需求再进行启用
 */
export class MinNavigationActivation implements NavigationActivation {
  constructor(
    readonly entry: NavigationHistoryEntry,
    readonly from: NavigationHistoryEntry | null,
    readonly navigationType: NavigationType
  ) {}
}
