(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(t){if(t.ep)return;t.ep=!0;const r=o(t);fetch(t.href,r)}})();var C;(function(e){var s=function(){function n(){this._dropEffect="move",this._effectAllowed="all",this._data={}}return Object.defineProperty(n.prototype,"dropEffect",{get:function(){return this._dropEffect},set:function(t){this._dropEffect=t},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"effectAllowed",{get:function(){return this._effectAllowed},set:function(t){this._effectAllowed=t},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"types",{get:function(){return Object.keys(this._data)},enumerable:!0,configurable:!0}),n.prototype.clearData=function(t){t!=null?delete this._data[t]:this._data=null},n.prototype.getData=function(t){return this._data[t]||""},n.prototype.setData=function(t,r){this._data[t]=r},n.prototype.setDragImage=function(t,r,a){var i=o._instance;i._imgCustom=t,i._imgOffset={x:r,y:a}},n}();e.DataTransfer=s;var o=function(){function n(){if(this._lastClick=0,n._instance)throw"DragDropTouch instance already created.";var t=!1;if(document.addEventListener("test",function(){},{get passive(){return t=!0,!0}}),"ontouchstart"in document){var r=document,a=this._touchstart.bind(this),i=this._touchmove.bind(this),c=this._touchend.bind(this),l=t?{passive:!1,capture:!1}:!1;r.addEventListener("touchstart",a,l),r.addEventListener("touchmove",i,l),r.addEventListener("touchend",c),r.addEventListener("touchcancel",c)}}return n.getInstance=function(){return n._instance},n.prototype._touchstart=function(t){var r=this;if(this._shouldHandle(t)){if(Date.now()-this._lastClick<n._DBLCLICK&&this._dispatchEvent(t,"dblclick",t.target)){t.cancelable&&t.preventDefault(),this._reset();return}this._reset();var a=this._closestDraggable(t.target);a&&!this._dispatchEvent(t,"mousemove",t.target)&&!this._dispatchEvent(t,"mousedown",t.target)&&(this._dragSource=a,this._ptDown=this._getPoint(t),this._lastTouch=t,t.cancelable&&t.preventDefault(),setTimeout(function(){r._dragSource==a&&r._img==null&&r._dispatchEvent(t,"contextmenu",a)&&r._reset()},n._CTXMENU),n._ISPRESSHOLDMODE&&(this._pressHoldInterval=setTimeout(function(){r._isDragEnabled=!0,r._touchmove(t)},n._PRESSHOLDAWAIT)))}},n.prototype._touchmove=function(t){if(this._shouldCancelPressHoldMove(t)){this._reset();return}if(this._shouldHandleMove(t)||this._shouldHandlePressHoldMove(t)){var r=this._getTarget(t);if(this._dispatchEvent(t,"mousemove",r)){this._lastTouch=t,t.cancelable&&t.preventDefault();return}this._dragSource&&!this._img&&this._shouldStartDragging(t)&&(this._dispatchEvent(t,"dragstart",this._dragSource),this._createImage(t),this._dispatchEvent(t,"dragenter",r)),this._img&&(this._lastTouch=t,t.cancelable&&t.preventDefault(),r!=this._lastTarget&&(this._dispatchEvent(this._lastTouch,"dragleave",this._lastTarget),this._dispatchEvent(t,"dragenter",r),this._lastTarget=r),this._moveImage(t),this._isDropZone=this._dispatchEvent(t,"dragover",r))}},n.prototype._touchend=function(t){if(this._shouldHandle(t)){if(this._dispatchEvent(this._lastTouch,"mouseup",t.target)){t.cancelable&&t.preventDefault();return}this._img||(this._dragSource=null,this._dispatchEvent(this._lastTouch,"click",t.target),this._lastClick=Date.now()),this._destroyImage(),this._dragSource&&(t.type.indexOf("cancel")<0&&this._isDropZone&&this._dispatchEvent(this._lastTouch,"drop",this._lastTarget),this._dispatchEvent(this._lastTouch,"dragend",this._dragSource),this._reset())}},n.prototype._shouldHandle=function(t){return t&&!t.defaultPrevented&&t.touches&&t.touches.length<2},n.prototype._shouldHandleMove=function(t){return!n._ISPRESSHOLDMODE&&this._shouldHandle(t)},n.prototype._shouldHandlePressHoldMove=function(t){return n._ISPRESSHOLDMODE&&this._isDragEnabled&&t&&t.touches&&t.touches.length},n.prototype._shouldCancelPressHoldMove=function(t){return n._ISPRESSHOLDMODE&&!this._isDragEnabled&&this._getDelta(t)>n._PRESSHOLDMARGIN},n.prototype._shouldStartDragging=function(t){var r=this._getDelta(t);return r>n._THRESHOLD||n._ISPRESSHOLDMODE&&r>=n._PRESSHOLDTHRESHOLD},n.prototype._reset=function(){this._destroyImage(),this._dragSource=null,this._lastTouch=null,this._lastTarget=null,this._ptDown=null,this._isDragEnabled=!1,this._isDropZone=!1,this._dataTransfer=new s,clearInterval(this._pressHoldInterval)},n.prototype._getPoint=function(t,r){return t&&t.touches&&(t=t.touches[0]),{x:r?t.pageX:t.clientX,y:r?t.pageY:t.clientY}},n.prototype._getDelta=function(t){if(n._ISPRESSHOLDMODE&&!this._ptDown)return 0;var r=this._getPoint(t);return Math.abs(r.x-this._ptDown.x)+Math.abs(r.y-this._ptDown.y)},n.prototype._getTarget=function(t){for(var r=this._getPoint(t),a=document.elementFromPoint(r.x,r.y);a&&getComputedStyle(a).pointerEvents=="none";)a=a.parentElement;return a},n.prototype._createImage=function(t){this._img&&this._destroyImage();var r=this._imgCustom||this._dragSource;if(this._img=r.cloneNode(!0),this._copyStyle(r,this._img),this._img.style.top=this._img.style.left="-9999px",!this._imgCustom){var a=r.getBoundingClientRect(),i=this._getPoint(t);this._imgOffset={x:i.x-a.left,y:i.y-a.top},this._img.style.opacity=n._OPACITY.toString()}this._moveImage(t),document.body.appendChild(this._img)},n.prototype._destroyImage=function(){this._img&&this._img.parentElement&&this._img.parentElement.removeChild(this._img),this._img=null,this._imgCustom=null},n.prototype._moveImage=function(t){var r=this;requestAnimationFrame(function(){if(r._img){var a=r._getPoint(t,!0),i=r._img.style;i.position="absolute",i.pointerEvents="none",i.zIndex="999999",i.left=Math.round(a.x-r._imgOffset.x)+"px",i.top=Math.round(a.y-r._imgOffset.y)+"px"}})},n.prototype._copyProps=function(t,r,a){for(var i=0;i<a.length;i++){var c=a[i];t[c]=r[c]}},n.prototype._copyStyle=function(t,r){if(n._rmvAtts.forEach(function(h){r.removeAttribute(h)}),t instanceof HTMLCanvasElement){var a=t,i=r;i.width=a.width,i.height=a.height,i.getContext("2d").drawImage(a,0,0)}for(var c=getComputedStyle(t),l=0;l<c.length;l++){var u=c[l];u.indexOf("transition")<0&&(r.style[u]=c[u])}r.style.pointerEvents="none";for(var l=0;l<t.children.length;l++)this._copyStyle(t.children[l],r.children[l])},n.prototype._dispatchEvent=function(t,r,a){if(t&&a){var i=document.createEvent("Event"),c=t.touches?t.touches[0]:t;return i.initEvent(r,!0,!0),i.button=0,i.which=i.buttons=1,this._copyProps(i,t,n._kbdProps),this._copyProps(i,c,n._ptProps),i.dataTransfer=this._dataTransfer,a.dispatchEvent(i),i.defaultPrevented}return!1},n.prototype._closestDraggable=function(t){for(;t;t=t.parentElement)if(t.hasAttribute("draggable")&&t.draggable)return t;return null},n}();o._instance=new o,o._THRESHOLD=5,o._OPACITY=.5,o._DBLCLICK=500,o._CTXMENU=900,o._ISPRESSHOLDMODE=!1,o._PRESSHOLDAWAIT=400,o._PRESSHOLDMARGIN=25,o._PRESSHOLDTHRESHOLD=0,o._rmvAtts="id,class,style,draggable".split(","),o._kbdProps="altKey,ctrlKey,metaKey,shiftKey".split(","),o._ptProps="pageX,pageY,clientX,clientY,screenX,screenY".split(","),e.DragDropTouch=o})(C||(C={}));const m={topNChanged:"topNChanged",recentInDaysChanged:"recentInDaysChanged",searchFilterChanged:"searchFilterChanged",rankingsDataSet:"rankingsDataSet",rankingsFiltered:"rankingsFiltered",resultsSorted:"resultsSorted",sortColumnsChanged:"sortColumnsChanged"},P=e=>({type:m.rankingsDataSet,payload:e}),N=(e=b.rankings,s)=>{const{type:o,payload:n}=s;switch(o){case m.rankingsDataSet:return{lastUpdated:n.refreshed,data:n}}return e},w=(e,s)=>({type:m.rankingsFiltered,payload:{rankingsData:e,filters:s}}),A=e=>({type:m.resultsSorted,payload:e}),x=(e=[],s)=>{const{type:o,payload:n}=s;switch(o){case m.rankingsFiltered:return $(n.rankingsData,n.filters);case m.resultsSorted:return q(e,n)}return e};function $(e,s){const{topN:o,recentInDays:n}=s,t=24*60*60*1e3,r=[];for(const a of e.events)for(const i of a.rankings)for(const c of i.ranks){const l=e.competitions.find(d=>d.id===c.competition);if(!l)throw`Missing competition ID ${c.competition}`;const u=e.persons.find(d=>d.id===c.id);if(!u)throw`Missing competitor ID ${c.id}`;const h=Math.floor((new Date().getTime()-new Date(l.startDate).getTime())/t),p={eventID:a.id,eventName:a.name,eventType:i.type,eventFormat:a.format,age:i.age,date:l.startDate,rank:c.rank,name:u.name,wcaID:u.id,result:c.best,compName:l.name,compWebID:l.webId,compCountry:l.country};if(h<=n&&F(p,s)&&r.push(p),c.rank>Math.min(i.ranks.length,o)-1)break}return r}function F(e,s){const{search:o}=s;return o?["date","eventID","eventType","name","compName"].reduce((r,a)=>r+" "+e[a],"").toLowerCase().includes(o.toLowerCase()):!0}function q(e,s){const o=[...e];return[...s].reverse().map(t),o;function t(r){const{name:a,direction:i}=r;switch(a){case"date":case"name":o.sort((u,h)=>i*u[a].localeCompare(h[a]));break;case"age":case"rank":o.sort((u,h)=>i*(u[a]-h[a]));break;case"event":o.sort(c);break;case"result":o.sort(l);break}return o;function c(u,h){const p=["333","222","444","555","666","777","333bf","333fm","333oh","clock","minx","pyram","skewb","sq1","444bf","555bf","333mbf"],d=p.indexOf(u.eventID),_=p.indexOf(h.eventID);return d===_&&u.eventType!==h.eventType?i*(u.eventType==="single"?-1:1):i*(d-_)}function l(u,h){if(u.eventFormat!==h.eventFormat)return u.eventFormat==="time"||h.eventFormat==="time"?i*(u.eventFormat==="time"?-1:1):i*(u.eventFormat==="number"?-1:1);switch(u.eventFormat){case"time":{const[p,d]=[u.result,h.result].map(I);return i*(p-d)}case"number":return i*(Number(u.result)-Number(h.result));case"multi":{const[p,d]=[u.result,h.result].map(K);return p.score!==d.score?-i*(p.score-d.score):p.seconds!==d.seconds?i*(p.seconds-d.seconds):i*(p.unsolved-d.unsolved)}}}}}function K(e){const[s,o]=e.split(" in "),[n,t]=s.split("/").map(Number),r=t-n,a=n-r,i=I(o);return{score:a,seconds:i,unsolved:r}}function I(e){const s=e.split(":").reverse();let o=0,n=1;for(const t of s)o+=+t*n,n*=60;return o}const U=e=>({type:m.topNChanged,payload:e}),Y=e=>({type:m.recentInDaysChanged,payload:e}),B=e=>({type:m.searchFilterChanged,payload:e}),X=(e=b.filters,s)=>{const{type:o,payload:n}=s;switch(o){case m.topNChanged:return{...e,topN:n};case m.recentInDaysChanged:return{...e,recentInDays:n};case m.searchFilterChanged:return{...e,search:n}}return e},T=e=>({type:m.sortColumnsChanged,payload:e}),G=(e=[],s)=>{const{type:o,payload:n}=s;switch(o){case m.sortColumnsChanged:return j(e,n)}return e};function j(e,s){const o=[...e],n=e.findIndex(t=>t.name===s.name);return n<0?(o[s.position]={name:s.name,label:s.label,direction:s.defaultDirection||1},o):n===s.position?(o[s.position].direction*=-1,o):(o.splice(n,1),o.splice(s.position,0,e[n]),o)}const b={rankings:{lastUpdated:null,data:{}},results:[],filters:{topN:10,recentInDays:30,search:""},sortColumns:[{name:"date",label:"Date",direction:-1},{name:"rank",label:"Rank",direction:1},{name:"event",label:"Event",direction:1}]},W=z({rankings:N,results:x,filters:X,sortColumns:G}),Z=(e,s)=>{let o=e;function n(){return o}function t(r){o=s(n(),r)}return{getState:n,dispatch:t}};function z(e){return function(s=b,o){const n={...s};for(const t in e)n[t]=e[t](s[t],o);return n}}function J(e){const s=document.querySelector(e);function o(n){if(!s)throw new Error(`render(): "${e}" was not found`);Array.isArray(n)?s.replaceChildren(...n):s.replaceChildren(n)}return{render:o}}function g(e){const s=document.querySelector(`template${e}`);if(!s)throw new Error(`Unable to find "${e}" in getTemplateElement()`);const n=s.content.cloneNode(!0).firstElementChild;if(!(n instanceof HTMLElement))throw new Error(`Template "${e}" does not contain an HTML element`);return n}function f(e,s,o){const n=e.querySelector(s);if(!n||!(n instanceof o))throw new Error(`No ${o.name} element found matching ${s}`);return n}function Q(e){const{store:s}=e,{results:o}=s.getState(),{lastUpdated:n}=s.getState().rankings,{topN:t,recentInDays:r,search:a}=s.getState().filters,i=g("#info-template"),c=f(i,".result-info",HTMLElement),l=f(i,".refreshed",HTMLElement);return l.textContent=`Last refreshed: ${n} (UTC)`,c.textContent=`Showing ${o.length} ${o.length===1?"result":"results"} ${a?' matching "'+a+'"':""} in the top ${t} set in the past ${r} day(s) `,i}let D,L,v;function V(e){D=e.store,L=e.handleRender;const{sortColumns:s}=D.getState(),o=g("#sort-column-list-template");for(const[n,t]of s.entries()){const r=g("#sort-column-template"),a={0:"primary",1:"secondary",2:"tertiary"},i=t.direction==1?"ascending":"descending";r.classList.add(i),r.classList.add(a[n]),r.dataset.sortOn=t.name,r.dataset.position=String(n);const c=document.createTextNode(t.label);r.insertBefore(c,r.firstChild),r.addEventListener("dragstart",O),r.addEventListener("dragenter",nt),r.addEventListener("dragover",et),r.addEventListener("dragleave",rt),r.addEventListener("drop",st),r.addEventListener("dragend",R),r.addEventListener("click",tt),o.append(r)}return o}function tt(e){const s=e.currentTarget,o=String(s.dataset.sortOn),n=String(s.textContent),t=Number(s.dataset.position);D.dispatch(T({name:o,label:n,position:t,defaultDirection:null})),L()}function O(e){const s=e.currentTarget,o=e.dataTransfer;v=s,s.style.opacity="0.4",o.effectAllowed="move"}function et(e){const s=e.dataTransfer;e.preventDefault(),s.dropEffect="move"}function nt(e){e.currentTarget.classList.add("over")}function rt(e){e.currentTarget.classList.remove("over")}function st(e){const s=e.currentTarget;if(e.stopPropagation(),s.classList.remove("over"),v.dataset.sortOn!==s.dataset.sortOn){const o=v.querySelector("span.text"),n=String(v.dataset.sortOn),t=String(o==null?void 0:o.textContent).trim(),r=Number(s.dataset.position),a=Number(v.dataset.defaultDirection)||null;D.dispatch(T({name:n,label:t,position:r,defaultDirection:a})),L()}}function R(e){e.currentTarget.removeAttribute("style")}function ot(e){const{store:s,handleRender:o}=e,{search:n}=s.getState().filters,t=g("#search-template"),r=f(t,"input",HTMLInputElement);return r.value=n,r.addEventListener("input",a=>{const i=a.currentTarget;s.dispatch(B(i.value)),o()}),t}function it(e){const{store:s,handleRender:o}=e,{recentInDays:n,topN:t}=s.getState().filters,r=g("#parameters-template"),a=f(r,"#recent-in-days",HTMLSelectElement);a.value=String(n),a.addEventListener("change",c=>{const l=c.currentTarget;s.dispatch(Y(Number(l.value))),o()});const i=f(r,"#top-n",HTMLSelectElement);return i.value=String(t),i.addEventListener("change",c=>{const l=c.currentTarget;s.dispatch(U(Number(l.value))),o()}),r}function at(e){const s=g("#panel-template");return f(s,".panel-grid",HTMLElement).append(ot(e),it(e),V(e)),s}function ct(e){const{results:s}=e.store.getState();return!s||s.length===0?dt():lt(e)}function lt(e){const{store:s,handleRender:o}=e,{results:n}=s.getState(),t=g("#ranking-table-template");t.querySelector("tbody").append(...n.map(ut));const a=t.querySelectorAll("thead th");for(const i of a){const c=i.querySelector("button");if(c){const{sortColumns:l}=s.getState(),u=String(i.dataset.sortOn),h=String(c.textContent),p={0:"primary",1:"secondary",2:"tertiary"};for(const[d,_]of l.entries()){const E=_.direction==1?"ascending":"descending";_.name===u&&(d===0&&i.setAttribute("aria-sort",E),i.classList.add(E),i.classList.add(p[d]))}i.addEventListener("dragstart",O),i.addEventListener("dragend",R),c.addEventListener("click",d=>{const _=(d.ctrlKey?1:0)+(d.shiftKey?1:0),E=Number(i.dataset.defaultDirection)||1;s.dispatch(T({name:u,label:h,position:_,defaultDirection:E})),o()})}}return t}function ut(e){const s="https://www.worldcubeassociation.org/persons",o="https://www.worldcubeassociation.org/competitions",n="https://wca-seniors.org/Senior_Rankings.html",t=g("#result-row-template"),r=f(t,"td.date",HTMLElement),a=e.date.indexOf("-");r.innerHTML=e.date.slice(0,a+1)+"<wbr>"+e.date.slice(a+1);const i=f(t,"td.event",HTMLElement);f(i,"i.icon",HTMLElement).classList.add(`event-${e.eventID}`),i.append(`${e.eventID} ${e.eventType}`);const l=f(t,"td.age a",HTMLAnchorElement);l.textContent=`${e.age}+`,l.href=`${n}#${e.eventID}-${e.eventType}-${e.age}`;const u=f(t,"td.rank",HTMLElement);u.textContent=String(e.rank);const h=f(t,"td.name a",HTMLAnchorElement);h.textContent=e.name,h.href=`${s}/${e.wcaID}?event=${e.eventID}`;const p=f(t,"td.result",HTMLElement);p.textContent=e.result;const d=f(t,"td.competition a",HTMLAnchorElement);return d.textContent=e.compName,d.href=`${o}/${e.compWebID}/results/by_person#${e.wcaID}`,f(t,"td.competition i.flag",HTMLElement).classList.add(`flag-${e.compCountry}`),t}function dt(){return g("#no-results-template")}function ht(e){const s=[];return s.push(Q(e),at(e),ct(e)),s}function pt(){return g("#loading-template")}function H(e){const s=g("#error-template"),o=f(s,".message",HTMLElement);return o.textContent=e,s}const S=J("#app"),M=window.rankings||null;if(!M)throw S.render(H("The rankings data is missing, try back in a bit.")),new Error("Missing rankings data");const y=Z(b,W);y.dispatch(P(M));k();function k(){var e,s;try{const o=y.getState(),n=((e=document.activeElement)==null?void 0:e.id)||null;S.render(pt()),y.dispatch(w(o.rankings.data,o.filters)),y.dispatch(A(o.sortColumns)),S.render(ht({store:y,handleRender:k})),n&&((s=document.getElementById(n))==null||s.focus())}catch(o){throw S.render(H(o)),o}}
