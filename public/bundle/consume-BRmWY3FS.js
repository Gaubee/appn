import { s as s$1 } from './create-context-CT4pxGTb.js';

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class s{constructor(t,s,i,h){if(this.subscribe=false,this.provided=false,this.value=void 0,this.t=(t,s)=>{this.unsubscribe&&(this.unsubscribe!==s&&(this.provided=false,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=t,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=true,this.callback&&this.callback(t,s)),this.unsubscribe=s;},this.host=t,void 0!==s.context){const t=s;this.context=t.context,this.callback=t.callback,this.subscribe=t.subscribe??false;}else this.context=s,this.callback=i,this.subscribe=h??false;this.host.addController(this);}hostConnected(){this.dispatchRequest();}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0);}dispatchRequest(){this.host.dispatchEvent(new s$1(this.context,this.host,this.t,this.subscribe));}}

/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function c({context:c,subscribe:e}){return (o,n)=>{"object"==typeof n?n.addInitializer((function(){new s(this,{context:c,callback:t=>{o.set.call(this,t);},subscribe:e});})):o.constructor.addInitializer((o=>{new s(o,{context:c,callback:t=>{o[n]=t;},subscribe:e});}));}}

export { c };
