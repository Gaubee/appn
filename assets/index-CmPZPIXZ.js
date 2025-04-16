import"./modulepreload-polyfill-B5Qt9EMX.js";import{C as f}from"./css-color-mix-B79xzPHc.js";const x=["hsl","hwb","lch","oklch"],n=document.querySelector(":root"),d=document.getElementById("color-space"),u=document.getElementById("interpolation-method"),y=document.getElementById("interpolation-method-label"),i=document.getElementById("color-one"),s=document.getElementById("color-two"),h=document.getElementById("mixed-color-native"),v=document.getElementById("mixed-color-shim"),P=document.getElementById("mix-output-text");document.getElementById("color-one-text");document.getElementById("color-two-text");const k=document.getElementById("percentage-one-label"),w=document.getElementById("percentage-two-label"),g=document.getElementById("percentage-one"),p=document.getElementById("percentage-two");let l,c;function B(){const r={el:".color-one",theme:"classic",useAsButton:!0,default:"#ff7f50",position:"bottom-middle",components:{preview:!0,opacity:!0,hue:!0,interaction:{hex:!0,rgba:!0,hsla:!0,input:!0,clear:!1,save:!0}},swatches:["rgb(244 67 54)","rgb(233 30 99)","rgb(156 39 176)","rgb(103 58 183)","rgb(63 81 181)","rgb(33 150 243)","rgb(3 169 244)","rgb(0 188 212)","rgb(0 150 136)","rgb(76 175 80)","rgb(139 195 74)","rgb(205 220 57)","rgb(255 235 59)","rgb(255 193 7)"]};l=Pickr.create(r),l.setColor("#ff7f50"),i.style.setProperty("background-color","#ff7f50"),l.on("change",e=>{i.style.setProperty("background-color",e.toRGBA()),o()}),l.on("cancel",e=>{i.style.setProperty("background-color",e.getColor().toRGBA()),o()}),l.on("show",(e,t)=>{t.getRoot().app.querySelector(":is(button, [tabindex])").focus()}),l.on("hide",e=>{i.focus()}),r.el=".color-two",r.default="#00ffff",c=Pickr.create(r),c.setColor("#00ffff"),s.style.setProperty("background-color","#00ffff"),c.on("change",(e,t,a)=>{s.style.setProperty("background-color",e.toRGBA()),o()}),c.on("cancel",e=>{s.style.setProperty("background-color",e.getColor().toRGBA()),o()}),c.on("show",(e,t)=>{t.getRoot().app.querySelector(":is(button, [tabindex])").focus()}),c.on("hide",e=>{s.focus()}),g.addEventListener("input",e=>{k.innerText=e.target.value+"%",o()}),p.addEventListener("input",e=>{w.innerText=e.target.value+"%",o()}),d.addEventListener("change",e=>{x.includes(e.target.value)?(u.style.visibility="visible",y.style.visibility="visible"):(u.style.visibility="hidden",y.style.visibility="hidden"),o()}),u.addEventListener("change",e=>{o()}),u.style.visibility="hidden",y.style.visibility="hidden"}function o(){n.style.setProperty("--color-space",d.value),x.includes(d.value)?n.style.setProperty("--interpolation-method",u.value):n.style.setProperty("--interpolation-method",""),n.style.setProperty("--color-one",i.style.getPropertyValue("background-color")),n.style.setProperty("--percentage-one",g.value+"%"),n.style.setProperty("--color-two",s.style.getPropertyValue("background-color")),n.style.setProperty("--percentage-two",p.value+"%");const r=i.style.getPropertyValue("background-color"),e=s.style.getPropertyValue("background-color");let t=g.value/100,a=p.value/100;Number.isNaN(t)&&(t=void 0),Number.isNaN(a)&&(a=void 0);const b=f.calcColorMixNative(d.value,r,e,t,a),m=f.calcColorMixShim(d.value,r,e,t,a);h.style.setProperty("background-color",b),v.style.setProperty("background-color",m),P.innerHTML=`
        native: <b>${window.getComputedStyle(h).backgroundColor}</b> by <i>${b}</i>
        <hr/>
        shim: <b>${window.getComputedStyle(v).backgroundColor}</b> by <i>${m}</i>
        `}B();o();
