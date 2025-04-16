import { s as s$1 } from './create-context-CT4pxGTb.js';

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class s{get value(){return this.o}set value(s){this.setValue(s);}setValue(s,t=false){const i=t||!Object.is(s,this.o);this.o=s,i&&this.updateObservers();}constructor(s){this.subscriptions=new Map,this.updateObservers=()=>{for(const[s,{disposer:t}]of this.subscriptions)s(this.o,t);},void 0!==s&&(this.value=s);}addCallback(s,t,i){if(!i)return void s(this.value);this.subscriptions.has(s)||this.subscriptions.set(s,{disposer:()=>{this.subscriptions.delete(s);},consumerHost:t});const{disposer:h}=this.subscriptions.get(s);s(this.value,h);}clearCallbacks(){this.subscriptions.clear();}}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let e$1 = class e extends Event{constructor(t,s){super("context-provider",{bubbles:true,composed:true}),this.context=t,this.contextTarget=s;}};class i extends s{constructor(s,e,i){super(void 0!==e.context?e.initialValue:i),this.onContextRequest=t=>{if(t.context!==this.context)return;const s=t.contextTarget??t.composedPath()[0];s!==this.host&&(t.stopPropagation(),this.addCallback(t.callback,s,t.subscribe));},this.onProviderRequest=s=>{if(s.context!==this.context)return;if((s.contextTarget??s.composedPath()[0])===this.host)return;const e=new Set;for(const[s,{consumerHost:i}]of this.subscriptions)e.has(s)||(e.add(s),i.dispatchEvent(new s$1(this.context,i,s,true)));s.stopPropagation();},this.host=s,void 0!==e.context?this.context=e.context:this.context=e,this.attachListeners(),this.host.addController?.(this);}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest);}hostConnected(){this.host.dispatchEvent(new e$1(this.context,this.host));}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e({context:e}){return (n,r)=>{const i$1=new WeakMap;if("object"==typeof r)return r.addInitializer((function(){i$1.set(this,new i(this,{context:e}));})),{get(){return n.get.call(this)},set(t){return i$1.get(this)?.setValue(t),n.set.call(this,t)},init(t){return i$1.get(this)?.setValue(t),t}};{n.constructor.addInitializer((n=>{i$1.set(n,new i(n,{context:e}));}));const o=Object.getOwnPropertyDescriptor(n,r);let s;if(void 0===o){const t=new WeakMap;s={get(){return t.get(this)},set(e){i$1.get(this).setValue(e),t.set(this,e);},configurable:true,enumerable:true};}else {const t=o.set;s={...o,set(e){i$1.get(this).setValue(e),t?.call(this,e);}};}return void Object.defineProperty(n,r,s)}}}

export { e, i };
