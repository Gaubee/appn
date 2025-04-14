import {map_delete_and_get, map_get_or_put} from '@gaubee/util';
import {css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {match} from 'ts-pattern';
import {safeProperty} from '../../utils/safe-property';
import {enumToSafeConverter} from '../../utils/safe-property/enum-to-safe-converter';

const CSS_STARTING_STYLE_MODE_ENUM_VALUES = ['auto', 'native', 'shim'] as const;
export type CssStartingStyleMode = (typeof CSS_STARTING_STYLE_MODE_ENUM_VALUES)[number];
type WatchElement = Document | Element | ShadowRoot | null;
@customElement('css-starting-style')
export class CssStartingStyleElement extends LitElement {
  static readonly isSupports = typeof CSSStartingStyleRule === 'function';
  static override readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    mode: 'closed' as const,
  };
  //   static readonly css_starting_style = css_starting_style;
  //   static readonly css_starting_style_native = css_starting_style_native;
  //   static readonly css_starting_style_shim = css_starting_style_shim;
  static override styles = css`
    :host {
      display: none;
    }
  `;
  @safeProperty(enumToSafeConverter(CSS_STARTING_STYLE_MODE_ENUM_VALUES))
  accessor mode: CssStartingStyleMode = 'auto';

  @property({type: String, attribute: true, reflect: true})
  accessor selector: string = '';
  @property({type: String, attribute: true, reflect: true})
  accessor slotted: string | null = null;
  @property({type: Boolean, attribute: true, reflect: true})
  accessor host: boolean = false;

  @property({type: String, attribute: true, reflect: true})
  accessor layer: string = '';
  @property({type: String, attribute: true, reflect: true})
  accessor cssText: string = '';

  private __styleEle = document.createElement('style');
  constructor() {
    super();
    this.append(this.__styleEle);
  }

  static #tasks = new WeakMap<Element, (() => void) & {matchs: string[]}>();
  private __watcher = new MutationObserver((mutations) => {
    let matchSelector = this.selector;
    let slotted = this.slotted;
    if (slotted != null) {
      if (slotted) {
        matchSelector = `${matchSelector}:[name=${slotted}]`;
      } else {
        matchSelector = `${matchSelector}:not([name])`;
      }
    }

    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node instanceof Element) {
          /**
           * 这里不可以立即执行 matchs 进行判断
           * 因为 lit 生命周期决定了 setProperty 不会立刻同步到 setAttribute 上，因此这里的 selector 可能不会正确匹配上
           *
           * 所以这里加入到微队列中，统一做匹配
           */
          const task = map_get_or_put(CssStartingStyleElement.#tasks, node, (node) => {
            const task = Object.assign(
              () => {
                CssStartingStyleElement.#tasks.delete(node);
                for (const selector of task.matchs) {
                  if (node.matches(selector)) {
                    node.setAttribute('css-starting-style-hook', '');
                    requestAnimationFrame(() => {
                      node.removeAttribute('css-starting-style-hook');
                    });
                    break;
                  }
                }
              },
              {matchs: []}
            );
            queueMicrotask(task);
            return task;
          });
          task.matchs.push(matchSelector);
        }
      }
      for (const node of m.removedNodes) {
        if (node instanceof Element) {
          if (map_delete_and_get(CssStartingStyleElement.#tasks, node)) {
            node.removeAttribute('css-starting-style-hook');
          }
        }
      }
    }
  });
  private __watched: WatchElement = null;
  private __effect_watch(watch: WatchElement) {
    if (watch) {
      if (this.__watched != watch) {
        if (this.__watched) {
          this.__watcher.disconnect();
        }
        this.__watched = watch;
        this.__watcher.observe(watch, {childList: true, subtree: true});
      }
    } else {
      if (this.__watched) {
        this.__watched = null;
        this.__watcher.disconnect();
      }
    }
  }

  private __root: ShadowRoot | Document | null = null;
  override connectedCallback(): void {
    const root = this.getRootNode();
    if ('querySelector' in root) {
      this.__root = root as ShadowRoot | Document;
    }
    super.connectedCallback();

    /// 因为host选择器是在选择父级，而 MutationObserver 无法监听父级元素的插入
    /// 因此这里的垫片行为是基于 css-starting-style 自身的 connectedCallback/disconnectedCallback 的生命周期来替代 :host 元素的插入移除的监听
    /// 这是有局限性的，但不可避免
    if (this.host && root instanceof ShadowRoot) {
      queueMicrotask(() => {
        if (this.dataset.mode === 'native') {
          return;
        }
        const hostEle = root.host;
        let matchSelector = this.selector;
        if (hostEle.matches(matchSelector)) {
          this.__hostEle = hostEle;
          hostEle.setAttribute('css-starting-style-hook', '');
          requestAnimationFrame(() => {
            hostEle.removeAttribute('css-starting-style-hook');
          });
        }
      });
    }
  }
  private __hostEle: Element | null = null;
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.__hostEle) {
      this.__hostEle.removeAttribute('css-starting-style-hook');
      this.__hostEle = null;
    }
    this.__effect_watch(null);
    this.__root = null;
  }
  // protected override willUpdate(_changedProperties: PropertyValues): void {
  //     super.willUpdate(_changedProperties);
  // }
  override render() {
    const {mode, cssText, layer, selector, slotted, host} = this;
    const useMode = mode === 'auto' ? (CssStartingStyleElement.isSupports ? ('native' as const) : ('shim' as const)) : mode;
    this.dataset.mode = useMode;

    let ruleText = match(useMode)
      .with('native', () => {
        this.__effect_watch(null);
        let querySelector = selector;
        if (slotted != null) {
          if (slotted) {
            querySelector = `::slotted(${selector}:where([name=${slotted}]))`;
          } else {
            querySelector = `::slotted(${selector}:not([name]))`;
          }
        } else if (host) {
          querySelector = `:host(${querySelector})`;
        }
        return `${querySelector}{@starting-style{${cssText}}}`;
      })
      .with('shim', () => {
        let watchEle: WatchElement = this.__root;
        // 如果选择器是 ::slotted() 开头，那么监听 hostElemnet
        if (slotted != null && watchEle instanceof ShadowRoot) {
          watchEle = watchEle.host;
        }

        if (host) {
          this.__effect_watch(null);
        } else {
          this.__effect_watch(watchEle);
        }

        let querySelector = `${selector}:where([css-starting-style-hook])`;
        if (slotted != null) {
          if (slotted) {
            querySelector = `::slotted(${querySelector}:where([name=${slotted}])`;
          } else {
            querySelector = `::slotted(${querySelector}:not([name]))`;
          }
        } else if (host) {
          querySelector = `:host(${querySelector})`;
        }
        return `${querySelector}{${cssText}}`;
      })
      .exhaustive();
    if (layer) {
      ruleText = `@layer ${layer}{${ruleText}}`;
    }
    this.__styleEle.innerHTML = ruleText;
  }
}

// @customElement('css-starting-hook')
// export class CssStartingHookElement extends LitElement {
//   static override styles = css`
//     :host {
//       display: none;
//     }
//   `;
//   #target: HTMLElement | null = null;
//   #raf_id: number = 0;
//   override connectedCallback() {
//     super.connectedCallback();
//     const target = this.parentElement;
//     if (!target) {
//       return;
//     }
//     this.#target = target;
//     target.setAttribute('css-starting-style-hook', '');
//     this.#raf_id = requestAnimationFrame(() => {
//       target.removeAttribute('css-starting-style-hook');
//     });
//   }
//   override disconnectedCallback() {
//     super.disconnectedCallback();
//     const target = this.#target;
//     if (target) {
//       this.#target = null;
//       target.removeAttribute('css-starting-style-hook');
//       this.#raf_id && cancelAnimationFrame(this.#raf_id);
//     }
//   }
//   protected override render() {
//     // this.dataset.enable = String(this.enabled);
//     return '';
//   }
// }

declare global {
  interface HTMLElementTagNameMap {
    'css-starting-style': CssStartingStyleElement;
    // 'css-starting-hook': CssStartingHookElement;
  }
}
