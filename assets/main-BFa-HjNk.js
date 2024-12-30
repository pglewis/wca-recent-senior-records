/* empty css               */(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();const I={rankingsDataSet:"rankingsDataSet"},O=e=>({type:I.rankingsDataSet,payload:e}),q=(e={},t)=>{const{type:n,payload:s}=t;switch(n){case I.rankingsDataSet:return{lastUpdated:s.refreshed,data:s}}return e},S={rankingsFiltered:"rankingsFiltered",resultsSorted:"resultsSorted"},F=(e,t)=>({type:S.rankingsFiltered,payload:{rankingsData:e,filters:t}}),x=e=>({type:S.resultsSorted,payload:e}),w=(e=[],t)=>{const{type:n,payload:s}=t;switch(n){case S.rankingsFiltered:{const{rankingsData:r,filters:a}=s;return P(r,a)}case S.resultsSorted:return M(e,s)}return e};function P(e,t){const{topN:n,recentInDays:s}=t,r=24*60*60*1e3,a=[];for(const o of e.events)for(const c of o.rankings)for(const l of c.ranks){const m=e.competitions.find(u=>u.id===l.competition),i=e.persons.find(u=>u.id===l.id),p=Math.floor((new Date-new Date(m.startDate))/r),d={eventID:o.id,eventName:o.name,eventType:c.type,eventFormat:o.format,age:c.age,date:m.startDate,rank:l.rank,name:i.name,wcaID:i.id,result:l.best,compName:m.name,compWebID:m.webId,compCountry:m.country};if(p<=s&&_(d,t)&&a.push(d),l.rank>Math.min(c.ranks.length,n)-1)break}return a}function _(e,t){const{search:n}=t;return n?["date","eventID","eventType","name","compName"].reduce((a,o)=>a+" "+e[o],"").toLowerCase().includes(n.toLowerCase()):!0}function M(e,t){const n=[...e];return[...t].reverse().map(r),n;function r(a){const{name:o,direction:c}=a;switch(o){case"date":case"name":n.sort((i,p)=>c*i[o].localeCompare(p[o]));break;case"age":case"rank":n.sort((i,p)=>c*(i[o]-p[o]));break;case"event":n.sort(l);break;case"result":n.sort(m);break}return n;function l(i,p){const d=["333","222","444","555","666","777","333bf","333fm","333oh","clock","minx","pyram","skewb","sq1","444bf","555bf","333mbf"],u=d.indexOf(i.eventID),g=d.indexOf(p.eventID);return u===g&&i.eventType!==p.eventType?c*(i.eventType==="single"?-1:1):c*(u-g)}function m(i,p){if(i.eventFormat!==p.eventFormat)return i.eventFormat==="time"||p.eventFormat==="time"?c*(i.eventFormat==="time"?-1:1):c*(i.eventFormat==="number"?-1:1);switch(i.eventFormat){case"time":{const[d,u]=[i.result,p.result].map(R);return c*(d-u)}case"number":return c*(i.result-p.result);case"multi":{const[d,u]=[i.result,p.result].map(U);return d.score!==u.score?-c*(d.score-u.score):d.seconds!==u.seconds?c*(d.seconds-u.seconds):c*(d.unsolved-u.unsolved)}}}}}function U(e){const[t,n]=e.split(" in "),[s,r]=t.split("/"),a=r-s,o=s-a,c=R(n);return{score:o,seconds:c,unsolved:a}}function R(e){const t=e.split(":").reverse();let n=0,s=1;for(const r of t)n+=+r*s,s*=60;return n}const h={topNChanged:"topNChanged",recentInDaysChanged:"recentInDaysChanged",searchFilterChanged:"searchFilterChanged"},Y=e=>({type:h.topNChanged,payload:e}),B=e=>({type:h.recentInDaysChanged,payload:e}),K=e=>({type:h.searchFilterChanged,payload:e}),G=(e={},t)=>{const{type:n,payload:s}=t;switch(n){case h.topNChanged:return{...e,topN:s};case h.recentInDaysChanged:return{...e,recentInDays:s};case h.searchFilterChanged:return{...e,search:s}}return e},D={sortColumnsChanged:"sortColumnsChanged"},k=e=>({type:D.sortColumnsChanged,payload:e}),W=(e=[],t)=>{const{type:n,payload:s}=t;switch(n){case D.sortColumnsChanged:return H(e,s)}return e};function H(e,t){const n=[...e],s=e.findIndex(r=>r.name===t.name);return s<0?(n[t.position]={name:t.name,label:t.label,direction:t.defaultDirection||1},n):s===t.position?(n[t.position].direction*=-1,n):(n.splice(s,1),n.splice(t.position,0,e[s]),n)}const j={rankings:{lastUpdated:null,data:null},results:[],filters:{topN:10,recentInDays:30,search:null},sortColumns:[{name:"date",label:"Date",direction:-1},{name:"rank",label:"Rank",direction:1},{name:"event",label:"Event",direction:1}]},z=Q({rankings:q,results:w,filters:G,sortColumns:W}),J=(e,t)=>{let n=e;function s(){return n}function r(a){n=t(s(),a)}return{getState:s,dispatch:r}};function Q(e){return function(t={},n){const s={};for(const r in e)s[r]=e[r](t[r],n);return s}}function f(e){const t=document.querySelector(`template${e}`);if(!t)throw`Unable to find "${e}" in getTemplateElement()`;return t.content.cloneNode(!0).firstElementChild}let b,L,y;function V(e){b=e.store,L=e.handleRender;const{sortColumns:t}=b.getState(),n=f("#sort-column-list-template");for(const[s,r]of t.entries()){const a=f("#sort-column-template"),o=a.querySelector("button"),c={0:"primary",1:"secondary",2:"tertiary"},l=r.direction==1?"ascending":"descending";o.classList.add(l),o.classList.add(c[s]),o.dataset.sortOn=r.name,o.dataset.position=s,o.textContent=r.label,o.addEventListener("dragstart",E),o.addEventListener("dragenter",ee),o.addEventListener("dragover",Z),o.addEventListener("dragleave",te),o.addEventListener("drop",ne),o.addEventListener("dragend",N),o.addEventListener("click",X),n.append(a)}return n}function X(e){const t=e.target;b.dispatch(k({name:t.dataset.sortOn,label:t.textContent,position:+t.dataset.position,defaultDirection:null})),L()}function E(e){const t=e.target;y=t,t.style.opacity="0.4",e.dataTransfer.effectAllowed="move"}function Z(e){return e.preventDefault(),e.dataTransfer.dropEffect="move",!1}function ee(e){e.target.classList.add("over")}function te(e){e.target.classList.remove("over")}function ne(e){const t=e.target;return e.stopPropagation(),t.classList.remove("over"),y.dataset.sortOn!==t.dataset.sortOn&&(b.dispatch(k({name:y.dataset.sortOn,label:y.textContent.trim(),position:+t.dataset.position,defaultDirection:y.dataset.defaultDirection||null})),L()),!1}function N(e){e.target.removeAttribute("style")}function re(e){const t=f("#panel-template");return t.querySelector(".panel-grid").append(V(e),se(e),oe(e)),t}function se(e){const{store:t,handleRender:n}=e,{search:s}=t.getState().filters,r=f("#search-template"),a=r.querySelector("input");return a.value=s||"",a.addEventListener("input",o=>{t.dispatch(K(o.target.value)),n()}),r}function oe(e){const{store:t,handleRender:n}=e,{recentInDays:s,topN:r}=t.getState().filters,a=f("#parameters-template"),o=a.querySelector("#recent-in-days");o.value=s,o.addEventListener("change",l=>{t.dispatch(B(+l.target.value)),n()});const c=a.querySelector("#top-n");return c.value=r,c.addEventListener("change",l=>{t.dispatch(Y(+l.target.value)),n()}),a}function ae(e){const{store:t,handleRender:n}=e,{results:s}=t.getState(),r=f("#ranking-table-template");r.querySelector("tbody").append(...s.map(ce));for(const o of r.querySelectorAll("thead th")){const c=o.querySelector("button");if(c){const{sortColumns:l}=t.getState(),m=o.dataset.sortOn,i=c.textContent,p={0:"primary",1:"secondary",2:"tertiary"};for(const[d,u]of l.entries()){const g=u.direction==1?"ascending":"descending";u.name===m&&(d===0&&o.setAttribute("aria-sort",g),o.classList.add(g),o.classList.add(p[d]))}o.addEventListener("dragstart",E),o.addEventListener("dragend",N),c.addEventListener("click",d=>{const u=(d.ctrlKey?1:0)+(d.shiftKey?1:0),g=o.dataset.defaultDirection||1;t.dispatch(k({name:m,label:i,position:u,defaultDirection:g})),n()})}}return r}function ce(e){const t="https://www.worldcubeassociation.org/persons",n="https://www.worldcubeassociation.org/competitions",s="https://wca-seniors.org/Senior_Rankings.html",r=f("#result-row-template");r.querySelector("td.date").textContent=e.date;const a=r.querySelector("td.event");a.querySelector("i.icon").classList.add(`event-${e.eventID}`),a.append(`${e.eventID} ${e.eventType}`);let o=r.querySelector("td.age a");o.textContent=`${e.age}+`,o.href=`${s}#${e.eventID}-${e.eventType}-${e.age}`,r.querySelector("td.rank").textContent=e.rank;const c=r.querySelector("td.name a");c.textContent=e.name,c.href=`${t}/${e.wcaID}?event=${e.eventID}`;const l=r.querySelector("td.result");l.textContent=e.result;const m=r.querySelector("td.competition a");return m.textContent=e.compName,m.href=`${n}/${e.compWebID}/results/by_person#${e.wcaID}`,r.querySelector("td.competition i.flag").classList.add(`flag-${e.compCountry}`),r}function ie(e){const t=document.querySelector(e);function n(s){Array.isArray(s)?t.replaceChildren(...s):t.replaceChildren(s)}return{render:n}}function le(e){const{results:t}=e.store.getState(),n=[];return n.push(de(e)),n.push(re(e)),t.length===0?n.push(ue()):n.push(ae(e)),n}function de(e){const{store:t}=e,{results:n}=t.getState(),{lastUpdated:s}=t.getState().rankings,{topN:r,recentInDays:a,search:o}=t.getState().filters,c=f("#info-template"),l=c.querySelector(".result-info"),m=c.querySelector(".refreshed");return m.textContent=`Last refreshed: ${s} (UTC)`,l.textContent=`Showing ${n.length} ${n.length===1?"result":"results"} ${o?' matching "'+o+'"':""} in the top ${r} set in the past ${a} day(s) `,c}function ue(){return f("#no-results-template")}function pe(){return f("#loading-template")}function T(e){const t=f("#error-template"),n=t.querySelector(".message");return n.textContent=e,t}const C=ie("#app"),A=window.rankings||null;if(!A)throw C.render(T("The rankings data is missing, try back in a bit.")),"Missing rankings data";const v=J(j,z);v.dispatch(O(A));$();function $(){var e;try{const t=v.getState(),n=((e=document.activeElement)==null?void 0:e.id)||null;C.render(pe()),v.dispatch(F(t.rankings.data,t.filters)),v.dispatch(x(t.sortColumns)),C.render(le({store:v,handleRender:$})),n&&document.getElementById(n).focus()}catch(t){throw C.render(T(t)),t}}
