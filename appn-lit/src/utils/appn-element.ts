import {pureEvent, type PureEventWithApply} from '@gaubee/util';
import {LitElement, type PropertyDeclaration} from 'lit';

/**
 * 提供了一些生命周期的绑定
 */
export class AppnElement extends LitElement {
  private __onConnected?: PureEventWithApply<void>;
  protected get onConnected() {
    return (this.__onConnected ??= pureEvent());
  }
  override connectedCallback(): void {
    super.connectedCallback();
    this.__onConnected?.emit();
  }
  private __onDisconnected?: PureEventWithApply<void>;
  protected get onDisconnected() {
    return (this.__onDisconnected ??= pureEvent());
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.__onConnected?.emit();
  }
  private __onRequestUpdate?: PureEventWithApply<{
    name?: PropertyKey;
    oldValue?: unknown;
    options?: PropertyDeclaration;
  }>;
  protected get onRequestUpdate() {
    return (this.__onRequestUpdate ??= pureEvent());
  }
  override requestUpdate(
    name?: PropertyKey,
    oldValue?: unknown,
    options?: PropertyDeclaration
  ): void {
    super.requestUpdate(name, oldValue, options);
    this.__onRequestUpdate?.emit({name, oldValue, options});
  }
}
