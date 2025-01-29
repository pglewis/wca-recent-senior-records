(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();var ne;(function(t){var r=function(){function n(){this._dropEffect="move",this._effectAllowed="all",this._data={}}return Object.defineProperty(n.prototype,"dropEffect",{get:function(){return this._dropEffect},set:function(e){this._dropEffect=e},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"effectAllowed",{get:function(){return this._effectAllowed},set:function(e){this._effectAllowed=e},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"types",{get:function(){return Object.keys(this._data)},enumerable:!0,configurable:!0}),n.prototype.clearData=function(e){e!=null?delete this._data[e]:this._data=null},n.prototype.getData=function(e){return this._data[e]||""},n.prototype.setData=function(e,o){this._data[e]=o},n.prototype.setDragImage=function(e,o,s){var a=i._instance;a._imgCustom=e,a._imgOffset={x:o,y:s}},n}();t.DataTransfer=r;var i=function(){function n(){if(this._lastClick=0,n._instance)throw"DragDropTouch instance already created.";var e=!1;if(document.addEventListener("test",function(){},{get passive(){return e=!0,!0}}),"ontouchstart"in document){var o=document,s=this._touchstart.bind(this),a=this._touchmove.bind(this),u=this._touchend.bind(this),l=e?{passive:!1,capture:!1}:!1;o.addEventListener("touchstart",s,l),o.addEventListener("touchmove",a,l),o.addEventListener("touchend",u),o.addEventListener("touchcancel",u)}}return n.getInstance=function(){return n._instance},n.prototype._touchstart=function(e){var o=this;if(this._shouldHandle(e)){if(Date.now()-this._lastClick<n._DBLCLICK&&this._dispatchEvent(e,"dblclick",e.target)){e.cancelable&&e.preventDefault(),this._reset();return}this._reset();var s=this._closestDraggable(e.target);s&&!this._dispatchEvent(e,"mousemove",e.target)&&!this._dispatchEvent(e,"mousedown",e.target)&&(this._dragSource=s,this._ptDown=this._getPoint(e),this._lastTouch=e,e.cancelable&&e.preventDefault(),setTimeout(function(){o._dragSource==s&&o._img==null&&o._dispatchEvent(e,"contextmenu",s)&&o._reset()},n._CTXMENU),n._ISPRESSHOLDMODE&&(this._pressHoldInterval=setTimeout(function(){o._isDragEnabled=!0,o._touchmove(e)},n._PRESSHOLDAWAIT)))}},n.prototype._touchmove=function(e){if(this._shouldCancelPressHoldMove(e)){this._reset();return}if(this._shouldHandleMove(e)||this._shouldHandlePressHoldMove(e)){var o=this._getTarget(e);if(this._dispatchEvent(e,"mousemove",o)){this._lastTouch=e,e.cancelable&&e.preventDefault();return}this._dragSource&&!this._img&&this._shouldStartDragging(e)&&(this._dispatchEvent(e,"dragstart",this._dragSource),this._createImage(e),this._dispatchEvent(e,"dragenter",o)),this._img&&(this._lastTouch=e,e.cancelable&&e.preventDefault(),o!=this._lastTarget&&(this._dispatchEvent(this._lastTouch,"dragleave",this._lastTarget),this._dispatchEvent(e,"dragenter",o),this._lastTarget=o),this._moveImage(e),this._isDropZone=this._dispatchEvent(e,"dragover",o))}},n.prototype._touchend=function(e){if(this._shouldHandle(e)){if(this._dispatchEvent(this._lastTouch,"mouseup",e.target)){e.cancelable&&e.preventDefault();return}this._img||(this._dragSource=null,this._dispatchEvent(this._lastTouch,"click",e.target),this._lastClick=Date.now()),this._destroyImage(),this._dragSource&&(e.type.indexOf("cancel")<0&&this._isDropZone&&this._dispatchEvent(this._lastTouch,"drop",this._lastTarget),this._dispatchEvent(this._lastTouch,"dragend",this._dragSource),this._reset())}},n.prototype._shouldHandle=function(e){return e&&!e.defaultPrevented&&e.touches&&e.touches.length<2},n.prototype._shouldHandleMove=function(e){return!n._ISPRESSHOLDMODE&&this._shouldHandle(e)},n.prototype._shouldHandlePressHoldMove=function(e){return n._ISPRESSHOLDMODE&&this._isDragEnabled&&e&&e.touches&&e.touches.length},n.prototype._shouldCancelPressHoldMove=function(e){return n._ISPRESSHOLDMODE&&!this._isDragEnabled&&this._getDelta(e)>n._PRESSHOLDMARGIN},n.prototype._shouldStartDragging=function(e){var o=this._getDelta(e);return o>n._THRESHOLD||n._ISPRESSHOLDMODE&&o>=n._PRESSHOLDTHRESHOLD},n.prototype._reset=function(){this._destroyImage(),this._dragSource=null,this._lastTouch=null,this._lastTarget=null,this._ptDown=null,this._isDragEnabled=!1,this._isDropZone=!1,this._dataTransfer=new r,clearInterval(this._pressHoldInterval)},n.prototype._getPoint=function(e,o){return e&&e.touches&&(e=e.touches[0]),{x:o?e.pageX:e.clientX,y:o?e.pageY:e.clientY}},n.prototype._getDelta=function(e){if(n._ISPRESSHOLDMODE&&!this._ptDown)return 0;var o=this._getPoint(e);return Math.abs(o.x-this._ptDown.x)+Math.abs(o.y-this._ptDown.y)},n.prototype._getTarget=function(e){for(var o=this._getPoint(e),s=document.elementFromPoint(o.x,o.y);s&&getComputedStyle(s).pointerEvents=="none";)s=s.parentElement;return s},n.prototype._createImage=function(e){this._img&&this._destroyImage();var o=this._imgCustom||this._dragSource;if(this._img=o.cloneNode(!0),this._copyStyle(o,this._img),this._img.style.top=this._img.style.left="-9999px",!this._imgCustom){var s=o.getBoundingClientRect(),a=this._getPoint(e);this._imgOffset={x:a.x-s.left,y:a.y-s.top},this._img.style.opacity=n._OPACITY.toString()}this._moveImage(e),document.body.appendChild(this._img)},n.prototype._destroyImage=function(){this._img&&this._img.parentElement&&this._img.parentElement.removeChild(this._img),this._img=null,this._imgCustom=null},n.prototype._moveImage=function(e){var o=this;requestAnimationFrame(function(){if(o._img){var s=o._getPoint(e,!0),a=o._img.style;a.position="absolute",a.pointerEvents="none",a.zIndex="999999",a.left=Math.round(s.x-o._imgOffset.x)+"px",a.top=Math.round(s.y-o._imgOffset.y)+"px"}})},n.prototype._copyProps=function(e,o,s){for(var a=0;a<s.length;a++){var u=s[a];e[u]=o[u]}},n.prototype._copyStyle=function(e,o){if(n._rmvAtts.forEach(function(D){o.removeAttribute(D)}),e instanceof HTMLCanvasElement){var s=e,a=o;a.width=s.width,a.height=s.height,a.getContext("2d").drawImage(s,0,0)}for(var u=getComputedStyle(e),l=0;l<u.length;l++){var g=u[l];g.indexOf("transition")<0&&(o.style[g]=u[g])}o.style.pointerEvents="none";for(var l=0;l<e.children.length;l++)this._copyStyle(e.children[l],o.children[l])},n.prototype._dispatchEvent=function(e,o,s){if(e&&s){var a=document.createEvent("Event"),u=e.touches?e.touches[0]:e;return a.initEvent(o,!0,!0),a.button=0,a.which=a.buttons=1,this._copyProps(a,e,n._kbdProps),this._copyProps(a,u,n._ptProps),a.dataTransfer=this._dataTransfer,s.dispatchEvent(a),a.defaultPrevented}return!1},n.prototype._closestDraggable=function(e){for(;e;e=e.parentElement)if(e.hasAttribute("draggable")&&e.draggable)return e;return null},n}();i._instance=new i,i._THRESHOLD=5,i._OPACITY=.5,i._DBLCLICK=500,i._CTXMENU=900,i._ISPRESSHOLDMODE=!1,i._PRESSHOLDAWAIT=400,i._PRESSHOLDMARGIN=25,i._PRESSHOLDTHRESHOLD=0,i._rmvAtts="id,class,style,draggable".split(","),i._kbdProps="altKey,ctrlKey,metaKey,shiftKey".split(","),i._ptProps="pageX,pageY,clientX,clientY,screenX,screenY".split(","),t.DragDropTouch=i})(ne||(ne={}));function Oe(t){return(r={},i)=>{const n={};for(const e in t){const o=t[e];n[e]=o(r[e],i)}return n}}function Re(t,r){let i=t;function n(){return i}function e(o){i=r(n(),o)}return{getState:n,dispatch:e}}var h=(t=>(t.searchFilterChanged="searchFilterChanged",t.topNChanged="topNChanged",t.timeFrameChanged="timeFrameChanged",t.regionChanged="regionChanged",t.rankingsDataSet="rankingsDataSet",t.rankingsFiltered="rankingsFiltered",t.resultsSorted="resultsSorted",t.sortColumnsChanged="sortColumnsChanged",t.uiStateSet="uiStateSet",t))(h||{});function we(t){return{type:h.topNChanged,payload:t}}function Pe(t){return{type:h.timeFrameChanged,payload:t}}function xe(t){return{type:h.searchFilterChanged,payload:t}}function Ae(t){return{type:h.regionChanged,payload:t}}function ke(t=F.filters,r){const{type:i,payload:n}=r;switch(i){case h.topNChanged:return{...t,topN:n};case h.timeFrameChanged:return{...t,timeFrame:n};case h.searchFilterChanged:return{...t,search:n};case h.regionChanged:return{...t,region:n}}return t}function Le(t){return{type:h.rankingsDataSet,payload:t}}function Me(t=F.rankings,r){const{type:i,payload:n}=r;switch(i){case h.rankingsDataSet:return{lastUpdated:n.refreshed,data:n,competitionIDToIndex:He(n),personIDToIndex:Ne(n),continentIDToIndex:je(n),countryIDToIndex:$e(n)}}return t}function He(t){const r={};for(const[i,n]of t.competitions.entries())r[n.id]=i;return r}function Ne(t){const r={};for(const[i,n]of t.persons.entries())r[n.id]=i;return r}function je(t){const r={};for(const[i,n]of t.continents.entries())r[n.id]=i;return r}function $e(t){const r={};for(const[i,n]of t.countries.entries())r[n.id]=i;return r}function Fe(t,r){return{type:h.rankingsFiltered,payload:{rankings:t,filters:r}}}function qe(t,r){return{type:h.resultsSorted,payload:{sortColumns:t,region:r}}}function Ue(t=[],r){const{type:i,payload:n}=r;switch(i){case h.rankingsFiltered:return Be(n.rankings,n.filters);case h.resultsSorted:return Ke(t,n.sortColumns,n.region)}return t}function Be(t,r){var D,d,f,p,m,x,ee;const i=t.data,{competitionIDToIndex:n,personIDToIndex:e,continentIDToIndex:o,countryIDToIndex:s}=t,{topN:a,timeFrame:u}=r,l=24*60*60*1e3,g=[];for(const q of i.events)for(const S of q.rankings){const E={world:0,continents:{},countries:{}};for(const[Y,C]of S.ranks.entries()){const P=i.competitions[n[C.competition]];if(!P)throw new Error(`Missing competition ID ${C.competition}`);const A=i.persons[e[C.id]];if(!A)throw new Error(`Missing competitor ID ${C.id}`);const _=i.countries[s[A.country]];if(!_)throw new Error(`Missing country ID ${A.country}`);const T=i.continents[o[_.continent]];if(!T)throw new Error(`Missing continent ID ${_.continent}`);const Ie=Math.floor((new Date().getTime()-new Date(P.startDate).getTime())/l);E.world++,(D=E.continents)[d=T.id]??(D[d]=0),E.continents[T.id]++,(f=E.countries)[p=_.id]??(f[p]=0),E.countries[_.id]++;const I=((m=S.missing)==null?void 0:m.world)??0;let k,O=1,R;r.region==="continent"?((x=S.missing.continents)!=null&&x[T.id]?(k=S.missing.continents[T.id],I>0&&(O=k/I)):I>0&&(O=0),R=E.continents[T.id]+O*(C.rank-Y-1)):r.region==="country"?((ee=S.missing.countries)!=null&&ee[_.id]?(k=S.missing.countries[_.id],I>0&&(O=k/I)):I>0&&(O=0),R=E.countries[_.id]+O*(C.rank-Y-1)):(k=I,R=E.world+O*(C.rank-Y-1)),R=Number(R.toFixed(0));const te={eventID:q.id,eventName:q.name,eventType:S.type,eventFormat:q.format,age:S.age,date:P.startDate,rank:R,name:A.name,wcaID:A.id,continent:T,country:_,result:C.best,compName:P.name,compWebID:P.webId,compCountry:P.country};Ie<=u&&R<=a&&Ye(te,r)&&g.push(te)}}return g}function Ye(t,r){const{search:i}=r;return i?[t.date,t.eventID,t.continent.id,t.age,t.eventID,t.country.id,t.age,t.eventID,t.age,t.eventID,t.eventType,t.continent.id,t.age,t.eventID,t.eventType,t.country.id,t.age,t.eventID,t.eventType,t.age,t.name,t.compName].map(o=>String(o)).join(" ").toLowerCase().includes(i.toLowerCase()):!0}function Ke(t,r,i){const n=[...t];return[...r].reverse().map(o),n;function o(s){const{name:a,direction:u}=s;function l(d,f){switch(i){case"world":return u*(d.age-f.age);case"continent":{const p=`${d.continent.id} ${d.age}`,m=`${f.continent.id} ${f.age}`;return u*p.localeCompare(m)}case"country":{const p=`${d.country.id} ${d.age}`,m=`${f.country.id} ${f.age}`;return u*p.localeCompare(m)}}}function g(d,f){const p=["333","222","444","555","666","777","333bf","333fm","333oh","clock","minx","pyram","skewb","sq1","444bf","555bf","333mbf"],m=p.indexOf(d.eventID),x=p.indexOf(f.eventID);return m===x&&d.eventType!==f.eventType?u*(d.eventType==="single"?-1:1):u*(m-x)}function D(d,f){if(d.eventFormat!==f.eventFormat)return d.eventFormat==="time"||f.eventFormat==="time"?u*(d.eventFormat==="time"?-1:1):u*(d.eventFormat==="number"?-1:1);switch(d.eventFormat){case"time":{const[p,m]=[d.result,f.result].map(_e);return u*(p-m)}case"number":return u*(Number(d.result)-Number(f.result));case"multi":{const[p,m]=[d.result,f.result].map(Xe);return p.score!==m.score?-u*(p.score-m.score):p.seconds!==m.seconds?u*(p.seconds-m.seconds):u*(p.unsolved-m.unsolved)}}}switch(a){case"date":case"name":n.sort((d,f)=>u*d[a].localeCompare(f[a]));break;case"rank":n.sort((d,f)=>u*(d[a]-f[a]));break;case"event":n.sort(g);break;case"group":n.sort(l);break;case"result":n.sort(D);break}return n}}function Xe(t){const[r,i]=t.split(" in "),[n,e]=r.split("/").map(Number),o=e-n,s=n-o,a=_e(i);return{score:s,seconds:a,unsolved:o}}function _e(t){const r=t.split(":").reverse();let i=0,n=1;for(const e of r)i+=Number(e)*n,n*=60;return i}function J(t){return{type:h.sortColumnsChanged,payload:t}}function Ve(t=[],r){const{type:i,payload:n}=r;switch(i){case h.sortColumnsChanged:return Ge(t,n)}return t}function Ge(t,r){const i=[...t],n=t.findIndex(e=>e.name===r.name);return n<0?(i[r.position]={name:r.name,label:r.label,direction:r.defaultDirection||1},i):n===r.position?(i[r.position].direction*=-1,i):(i.splice(n,1),i.splice(r.position,0,t[n]),i)}function We(t){return{type:h.uiStateSet,payload:t}}function Ze(t=F.uiState,r){const{type:i,payload:n}=r;switch(i){case h.uiStateSet:return n}return t}const F={rankings:{lastUpdated:"",data:{},competitionIDToIndex:{},personIDToIndex:{},continentIDToIndex:{},countryIDToIndex:{}},results:[],filters:{search:"",topN:10,timeFrame:30,region:"world"},sortColumns:[{name:"date",label:"Date",direction:-1},{name:"rank",label:"Rank",direction:1},{name:"event",label:"Event",direction:1}],uiState:{scrollX:0,scrollY:0,activeID:null}},ze=Oe({rankings:Me,results:Ue,filters:ke,sortColumns:Ve,uiState:Ze});function Je(t){const r=document.querySelector(t);function i(n){if(!r)throw new Error(`render(): "${t}" was not found`);Array.isArray(n)?r.replaceChildren(...n):r.replaceChildren(n)}return{render:i}}var L={},v={},M={},H={},K={},re;function Qe(){return re||(re=1,Object.defineProperty(K,"__esModule",{value:!0})),K}var X={},oe;function et(){return oe||(oe=1,Object.defineProperty(X,"__esModule",{value:!0})),X}var V={},ie;function tt(){return ie||(ie=1,Object.defineProperty(V,"__esModule",{value:!0})),V}var G={},se;function nt(){return se||(se=1,Object.defineProperty(G,"__esModule",{value:!0})),G}var W={},ae;function rt(){return ae||(ae=1,Object.defineProperty(W,"__esModule",{value:!0})),W}var N={},ce;function ot(){if(ce)return N;ce=1,Object.defineProperty(N,"__esModule",{value:!0}),N.classnames=void 0;const t=s=>Object.entries(s).map(([a,u])=>u&&a),r=s=>!!s,i=(s,a,u)=>u.indexOf(s)===a,n=[];function e(s){return s?typeof s=="string"?[s]:Array.isArray(s)?s.flatMap(e).filter(r):t(s).filter(r):n}function o(s){const a=e(s).filter(i);return a.length>0?a.join(" "):void 0}return N.classnames=o,N}var ue;function it(){return ue||(ue=1,function(t){var r=H.__createBinding||(Object.create?function(n,e,o,s){s===void 0&&(s=o);var a=Object.getOwnPropertyDescriptor(e,o);(!a||("get"in a?!e.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return e[o]}}),Object.defineProperty(n,s,a)}:function(n,e,o,s){s===void 0&&(s=o),n[s]=e[o]}),i=H.__exportStar||function(n,e){for(var o in n)o!=="default"&&!Object.prototype.hasOwnProperty.call(e,o)&&r(e,n,o)};Object.defineProperty(t,"__esModule",{value:!0}),i(Qe(),t),i(et(),t),i(tt(),t),i(nt(),t),i(rt(),t),i(ot(),t)}(H)),H}var le;function ve(){if(le)return M;le=1,Object.defineProperty(M,"__esModule",{value:!0}),M.setAttributes=void 0;const t=it();function r(e,o){for(const s of Object.keys(e))s in o&&(o[s]=e[s])}const i=new RegExp("^on\\p{Lu}","u");function n(e,o){for(const s of Object.keys(o)){if(s==="__source"||s==="__self"||s==="tsxTag")continue;const a=o[s];if(s==="class"){const u=(0,t.classnames)(a);u&&e.setAttribute(s,u)}else if(s==="ref")a.current=e;else if(i.test(s)){const u=s.replace(/Capture$/,""),l=s!==u,g=u.toLowerCase().substring(2);e.addEventListener(g,a,l)}else s==="style"&&typeof a!="string"?r(a,e.style):s==="dangerouslySetInnerHTML"?e.innerHTML=a:a===!0?e.setAttribute(s,s):(a||a===0)&&e.setAttribute(s,a.toString())}}return M.setAttributes=n,M}var y={},de;function ye(){if(de)return y;de=1,Object.defineProperty(y,"__esModule",{value:!0}),y.applyTsxTag=y.createDomElement=y.applyChildren=void 0;function t(e,o){o instanceof Element?e.appendChild(o):typeof o=="string"||typeof o=="number"?e.appendChild(document.createTextNode(o.toString())):console.warn("Unknown type to append: ",o)}function r(e,o){for(const s of o)!s&&s!==0||(Array.isArray(s)?r(e,s):t(e,s))}y.applyChildren=r;function i(e,o){const s=o!=null&&o.is?{is:o.is}:void 0;return o!=null&&o.xmlns?document.createElementNS(o.xmlns,e,s):document.createElement(e,s)}y.createDomElement=i;function n(e,o){let s=e,a=o;return a&&"tsxTag"in a&&(s=a.tsxTag,!a.is&&e.includes("-")&&(a={...a,is:e})),{finalTag:s,finalAttrs:a}}return y.applyTsxTag=n,y}var fe;function st(){if(fe)return v;fe=1,Object.defineProperty(v,"__esModule",{value:!0}),v.createRef=v.h=v.createElement=void 0;const t=ve(),r=ye();function i(e,o,...s){if(typeof e=="function")return e({...o,children:s});const{finalTag:a,finalAttrs:u}=(0,r.applyTsxTag)(e,o),l=(0,r.createDomElement)(a,u);return u&&(0,t.setAttributes)(l,u),(0,r.applyChildren)(l,s),l}v.createElement=i,v.h=i;const n=()=>({current:null});return v.createRef=n,v}var j={},b={},he;function be(){if(he)return b;he=1,Object.defineProperty(b,"__esModule",{value:!0}),b.jsxDEV=b.jsxs=b.jsx=void 0;const t=ve(),r=ye();function i(n,e){if(typeof n=="function")return n(e);const{children:o,...s}=e,{finalTag:a,finalAttrs:u}=(0,r.applyTsxTag)(n,s),l=(0,r.createDomElement)(a,u);return(0,t.setAttributes)(l,u),(0,r.applyChildren)(l,[o]),l}return b.jsx=i,b.jsxs=i,b.jsxDEV=i,b}var pe;function at(){if(pe)return j;pe=1,Object.defineProperty(j,"__esModule",{value:!0}),j.defineCustomElement=void 0;const t=be();function r(i,n,e){return customElements.define(i,n,e),o=>(0,t.jsx)(i,o)}return j.defineCustomElement=r,j}var Z={},me;function ct(){return me||(me=1,Object.defineProperty(Z,"__esModule",{value:!0})),Z}var ge;function ut(){return ge||(ge=1,function(t){var r=L.__createBinding||(Object.create?function(n,e,o,s){s===void 0&&(s=o);var a=Object.getOwnPropertyDescriptor(e,o);(!a||("get"in a?!e.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return e[o]}}),Object.defineProperty(n,s,a)}:function(n,e,o,s){s===void 0&&(s=o),n[s]=e[o]}),i=L.__exportStar||function(n,e){for(var o in n)o!=="default"&&!Object.prototype.hasOwnProperty.call(e,o)&&r(e,n,o)};Object.defineProperty(t,"__esModule",{value:!0}),i(st(),t),i(at(),t),i(be(),t),i(ct(),t)}(L)),L}var c=ut();function lt(t){const{store:r}=t,{lastUpdated:i}=r.getState().rankings;return c.h("div",{id:"info"},c.h("p",{class:"refreshed"},"Last refreshed: ",i," (UTC)"),c.h("p",null,"Drag the columns in the sort column list to rearrange the sort order. Column headers can be dragged to the list to change the sort columns. You can also click a column header to set the primary sort, ctrl-click to set the secondary sort, and ctrl+shift-click to set the tertiary sort."))}let B,Q,$;function dt(t){return B=t.store,Q=t.handleRender,c.h("div",{id:"sort-columns"},c.h("div",{class:"strong"},"Sort:"),B.getState().sortColumns.map(ft))}function ft(t,r){const i=["primary","secondary","tertiary"],n=t.direction==1?"ascending":"descending";return c.h("button",{onClick:ht,onDragStart:De,onDragEnter:mt,onDragOver:pt,onDragLeave:gt,onDrop:_t,onDragEnd:Se,class:`sort-column ${n} ${i[r]} strong`,draggable:"true","data-sort-on":t.name,"data-position":r},t.label,c.h("span",{"aria-hidden":"true"}))}function ht(t){const r=t.currentTarget,i=String(r.dataset.sortOn),n=String(r.textContent).trim(),e=Number(r.dataset.position);B.dispatch(J({name:i,label:n,position:e,defaultDirection:null})),Q()}function De(t){const r=t.currentTarget,i=t.dataTransfer;$=r,r.style.opacity="0.4",i.effectAllowed="move"}function pt(t){const r=t.dataTransfer;t.preventDefault(),r.dropEffect="move"}function mt(t){t.currentTarget.classList.add("over")}function gt(t){t.currentTarget.classList.remove("over")}function _t(t){const r=t.currentTarget;if(t.stopPropagation(),r.classList.remove("over"),$.dataset.sortOn!==r.dataset.sortOn){const i=$.querySelector("span.text"),n=String($.dataset.sortOn),e=String(i==null?void 0:i.textContent).trim(),o=Number(r.dataset.position),s=Number($.dataset.defaultDirection)||null;B.dispatch(J({name:n,label:e,position:o,defaultDirection:s})),Q()}}function Se(t){t.currentTarget.removeAttribute("style")}function vt(t,r=300){let i=null;return(...n)=>{i!==null&&window.clearTimeout(i),i=window.setTimeout(()=>t(...n),r)}}function yt(){const t=["333bf","333 60","sq1 eu","555 au 40","50","skewb single na 50","clock average","333fm average","competitor name","competition name"];return"e.g. "+t[Math.floor(Math.random()*t.length)]}function bt(t){const{store:r,handleRender:i}=t,{search:n}=r.getState().filters;function e(o){const s=o.target;r.dispatch(xe(s.value)),i()}return c.h("div",{id:"search"},c.h("label",{class:"strong"},"Search: ",c.h("input",{value:n,onInput:vt(e,350),id:"search-input",type:"search",size:20,placeholder:yt()})))}const Dt=[{value:"5",label:"5"},{value:"10",label:"10"},{value:"25",label:"25"},{value:"50",label:"50"}],St=[{value:"world",label:"WR"},{value:"continent",label:"CR"},{value:"country",label:"NR"}],Et=[{value:"7",label:"7 days"},{value:"14",label:"14 days"},{value:"30",label:"30 days"},{value:"60",label:"60 days"},{value:"90",label:"90 days"}];function Ct(t){const{store:r,handleRender:i}=t,{timeFrame:n,topN:e,region:o}=r.getState().filters;function s(){r.dispatch(Pe(Number(this.value))),i()}function a(){r.dispatch(we(Number(this.value))),i()}function u(){r.dispatch(Ae(this.value)),i()}return c.h("div",{id:"parameters"},c.h("label",{class:"strong"},"Top: ",c.h("select",{id:"top-n",onChange:a},z(Dt,e))),c.h("label",{class:"strong"},"  Type: ",c.h("select",{id:"region",onChange:u},z(St,o))),c.h("label",{class:"strong"},"  Time frame: ",c.h("select",{id:"time-frame",onChange:s},z(Et,n))))}function z(t,r){return t.map(i=>c.h("option",{value:i.value,selected:i.value==r},i.label))}function Tt(t){const{results:r}=t.store.getState();return c.h("div",{id:"panel"},c.h("div",{class:"panel-grid"},c.h(bt,t),c.h(Ct,t),c.h(dt,t),c.h("div",{class:"strong"},"Showing ",r.length," ",r.length===1?"result":"results")))}const It=[{name:"date",label:"Date",defaultSortDirection:-1},{name:"event",label:"Event",defaultSortDirection:1},{name:"group",label:"Group",defaultSortDirection:1},{name:"rank",label:"Rank",defaultSortDirection:1},{name:"name",label:"Name",defaultSortDirection:1},{name:"result",label:"Result",defaultSortDirection:1},{name:"competition",label:"Competition",defaultSortDirection:null}];function Ot(t){const{results:r}=t.store.getState();return!r||r.length===0?Lt():Rt(t)}function Rt(t){const{results:r}=t.store.getState(),i=[];for(const n of r)i.push(c.h(kt,{rowData:n,appProps:t}));return c.h("table",{id:"ranking-table",class:"rankings sortable"},c.h("thead",null,c.h(wt,{headers:It,appProps:t})),c.h("tbody",null,i))}function wt(t){const{headers:r,appProps:i}=t,n=[];for(const e of r)n.push(c.h(Pt,{columnHeader:e,appProps:i}));return c.h("tr",null,n)}function Pt(t){const{columnHeader:r,appProps:i}=t;return r.defaultSortDirection===null?c.h(At,{columnHeader:r}):c.h(xt,{columnHeader:r,appProps:i})}function xt(t){const{columnHeader:r,appProps:i}=t,{sortColumns:n}=i.store.getState();function e(a){const u=(a.ctrlKey?1:0)+(a.shiftKey?1:0);i.store.dispatch(J({name:r.name,label:r.label,position:u,defaultDirection:r.defaultSortDirection})),i.handleRender()}const o=[r.name];let s=null;for(const[a,u]of n.entries())if(u.name===r.name){const l=u.direction==1?"ascending":"descending",g=["primary","secondary","tertiary"];o.push(l),o.push(g[a]),a===0&&(s=l)}return c.h("th",{draggable:"true",class:o.join(" "),"data-sort-on":r.name,"data-default-direction":r.defaultSortDirection,"aria-sort":s,onClick:e,onDragStart:De,onDragEnd:Se},c.h("button",{class:"strong",type:"button"},c.h("div",{class:"column"},c.h("span",{class:"text"},r.label)),c.h("div",{class:"column"},c.h("span",{class:"sort up","aria-hidden":"true"},"▲"),c.h("span",{class:"sort down","aria-hidden":"true"},"▼"))))}function At(t){return c.h("th",{class:`${t.columnHeader.name} no-sort strong`},c.h("span",null,t.columnHeader.label))}function kt(t){const r="https://www.worldcubeassociation.org/persons",i="https://www.worldcubeassociation.org/competitions",n="https://wca-seniors.org/Senior_Rankings.html",{rowData:e,appProps:o}=t,s=o.store.getState().filters.region,a=e.date.indexOf("-"),u=e.date.slice(0,a+1),l=e.date.slice(a+1),g=`${r}/${e.wcaID}?event=${e.eventID}`,D=`${i}/${e.compWebID}/results/by_person#${e.wcaID}`,d=`${n}#${e.eventID}-${e.eventType}-${e.age}`;let f;switch(s){case"world":{f=c.h("a",{href:d,target:"_blank"},e.age,"+");break}case"continent":{f=c.h("a",{href:d+`-${e.continent.id}`,target:"_blank"},e.continent.id," ",e.age,"+");break}case"country":{f=c.h("a",{href:d+`-xx-${e.country.id}`,target:"_blank"},e.country.id," ",e.age,"+");break}}return c.h("tr",null,c.h("td",{class:"date"},u,c.h("wbr",null),l),c.h("td",{class:"event"},c.h("i",{class:`event-${e.eventID} cubing-icon icon`}),e.eventID," ",e.eventType),c.h("td",{class:"group"},f),c.h("td",{class:"rank"},e.rank),c.h("td",{class:"name"},c.h("a",{href:g,target:"_blank"},c.h("span",{class:`flag-${e.country.id} flag`})," ",e.name)),c.h("td",{class:"result"},e.result),c.h("td",{class:"competition"},c.h("a",{href:D,target:"_blank"},c.h("span",{class:`flag-${e.compCountry} flag`})," ",e.compName)))}function Lt(){return c.h("h3",{class:"no-results"},"No results")}function Mt(t){return c.h("div",null,c.h(lt,t),c.h(Tt,t),c.h(Ot,t))}function Ht(){return c.h("h3",{class:"message"},"Loading... please wait")}function Ee(t){return c.h("div",{class:"error"},c.h("h3",null,"Something went wrong ™"),c.h("div",{class:"message"},t))}const Ce=window.rankings,U=Je("#app");if(!Ce)throw U.render(Ee("The rankings data is missing, try back in a bit.")),new Error("Missing rankings data");const w=Re(F,ze);w.dispatch(Le(Ce));Te();function Te(){try{const t=w.getState();w.dispatch(We(Nt())),U.render(Ht()),w.dispatch(Fe(t.rankings,t.filters)),w.dispatch(qe(t.sortColumns,t.filters.region)),U.render(Mt({store:w,handleRender:Te})),jt(w.getState().uiState)}catch(t){throw t instanceof Error&&U.render(Ee(t.message)),t}}function Nt(){var i;const t=F.uiState;t.scrollX=window.scrollX,t.scrollY=window.scrollY,t.activeID=((i=document.activeElement)==null?void 0:i.id)||null;const r=document.getElementById("search-input");return t.selectionStart=r==null?void 0:r.selectionStart,t.selectionEnd=r==null?void 0:r.selectionEnd,t.selectionDirection=r==null?void 0:r.selectionDirection,t}function jt(t){var i;t.activeID&&((i=document.getElementById(t.activeID))==null||i.focus());const r=document.getElementById("search-input");r.selectionStart=(t==null?void 0:t.selectionStart)||null,r.selectionEnd=(t==null?void 0:t.selectionEnd)||null,r.selectionDirection=(t==null?void 0:t.selectionDirection)||"none",window.scroll(t.scrollX,t.scrollY)}
