// ==UserScript==
// @name         Bahamut Anime Comment Mountains
// @version      0.1.0
// @description  彈幕密度山脈 for 巴哈姆特動畫瘋
// @author       JacobLinCool <jacoblincool@gmail.com> (https://github.com/JacobLinCool)
// @homepage     https://github.com/JacobLinCool/Bahamut-Anime-Comment-Mountains#readme
// @supportURL   https://github.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/issues
// @updateURL    https://raw.githubusercontent.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/main/dist/index.user.js
// @downloadURL  https://raw.githubusercontent.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/main/dist/index.user.js
// @namespace    http://tampermonkey.net/
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// ==/UserScript==

(()=>{var j=(u,y,l)=>new Promise((x,o)=>{var s=t=>{try{e(l.next(t))}catch(i){o(i)}},n=t=>{try{e(l.throw(t))}catch(i){o(i)}},e=t=>t.done?x(t.value):Promise.resolve(t.value).then(s,n);e((l=l.apply(u,y)).next())});(function(){setTimeout(()=>u(),1e3);function u(n=!1){return j(this,null,function*(){let e=yield s(()=>fetch("https://ani.gamer.com.tw/ajax/danmuGet.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`sn=${location.search.match(/\d+/)[0]}`}).then(t=>t.json()));if(o("Comments",e),n){let t=new Set(yield s(()=>fetch("https://ani.gamer.com.tw/ajax/keywordGet.php").then(i=>i.json()).then(i=>i.map(r=>r.keyword))));e=e.filter(i=>!t.has(i.text))}y(e,50)})}function y(n,e){let{canvas:t,ctx:i}=x(),r=l(n,e);i.clearRect(0,0,t.width,t.height),i.beginPath(),i.moveTo(0,t.height);let g=.3,w=.6,h=0,a=0,b=0,d=0,m=0,f=t.height,p=0;for(let c=0;c<r.length;c++){let v=t.height*(1-r[c]),C=t.height*(1-r[c+1])||0;C&&(h=(C-f)/(t.width/e),d=t.width/e*-g,m=d*h*w),i.bezierCurveTo(p-a,f-b,t.width/e*(c+.5)+d,v+m,t.width/e*(c+.5),v),a=d,b=m,f=v,p=t.width/e*(c+.5)}i.bezierCurveTo(p-a,f-b,t.width/e*(e+.5)+d,t.height+m,t.width/e*(e+.5),t.height),i.lineTo(t.width,t.height),i.closePath(),i.fill()}function l(n,e){n=n.sort((h,a)=>h.time-a.time);let t=n[n.length-1].time/e;o("Width",t);let i=new Array(e).fill(0),r=0;for(let h=0;h<n.length;h++){for(;n[h].time>(r+1)*t;)r++;i[r]++}o("Heights",i);let g=Math.max(...i);o("Max",g);let w=i.map(h=>h/g);return o("Normalized",w),w}function x(){let n=document.createElement("canvas");Object.assign(n,{width:1e3,height:150}),Object.assign(n.style,{position:"absolute",bottom:0,left:0,width:"100%",zIndex:15,opacity:.3});let e=n.getContext("2d");return Object.assign(e,{fillStyle:"white",strokeStyle:"white",lineJoin:"round",lineCap:"round",lineWidth:2}),document.querySelector(".control-bar-mask").appendChild(n),{canvas:n,ctx:e}}function o(...n){n.length>=1?console.log("%c[\u5F48\u5E55\u5C71\u8108]","color: orange; font-weight: bold;",...n):console.log()}function s(n,e=3){return j(this,null,function*(){for(let t=0;t<e;t++)try{return yield n()}catch(i){o("Retry",n,t+1,i)}throw new Error("Failed")})}})();})();
