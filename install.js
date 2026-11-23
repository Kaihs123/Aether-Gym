/* "Add to home screen" help for iPhone and Android, plus a note when a newer version is ready.
   Android/Chrome: a real Install button. iPhone/iPad: Safari has no install button, so we show the two taps. */
(function(){
"use strict";
var KEY="aether-gym-install-dismissed",DAYS=14;
var ua=navigator.userAgent||"";
var ios=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
var android=/Android/i.test(ua);
var macSafari=!ios&&/Macintosh/.test(ua)&&/Safari/.test(ua)&&!/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
var SEEN="aether-gym-install-seen";
var standalone=function(){return (window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true};
var prompt=null,el=null,sheet=null;
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function muted(){var t=+get(KEY)||0;return t&&Date.now()-t<DAYS*864e5}
function can(){return !standalone()&&(!!prompt||ios||android||macSafari)}
var SHARE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M8.2 7.6 12 3.8l3.8 3.8"/><path d="M6 11H5.5A1.5 1.5 0 0 0 4 12.5v6A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H18"/></svg>';
var PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/></svg>';
var DOTS='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5.5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="18.5" r="1.8"/></svg>';

function steps(){
  if(macSafari)return [[SHARE,"In Safari, click <b>File</b> in the menu bar, then <b>Add to Dock</b> (or click the Share button, then <b>Add to Dock</b>)."],[PLUS,"Click <b>Add</b>."],["","Open <b>AETHER Gym</b> from your Dock or Launchpad. It opens in its own window like an app."]];
  if(ios)return [[SHARE,"Tap the <b>Share</b> button in Safari (the square with an arrow, at the bottom or top of the screen)."],[PLUS,"Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>."],["","Open <b>AETHER Gym</b> from your home screen. It runs full screen like an app."]];
  return [[DOTS,"Tap the <b>menu</b> button in Chrome (three dots, top right)."],[PLUS,"Tap <b>Install app</b> or <b>Add to Home screen</b>, then <b>Install</b>."],["","Open <b>AETHER Gym</b> from your home screen. It runs full screen like an app."]];
}
function closeSheet(){if(sheet){sheet.remove();sheet=null}}
function openSheet(){
  closeSheet();
  sheet=document.createElement("div");sheet.className="inst-sheet";sheet.setAttribute("role","dialog");sheet.setAttribute("aria-modal","true");sheet.setAttribute("aria-label","Add to home screen");
  sheet.innerHTML='<div class="inst-card"><b class="inst-h">'+(macSafari?'Add AETHER Gym to your Dock':'Add AETHER Gym to your home screen')+'</b><p class="inst-p">It opens full screen like an app, loads fast and keeps your training saved to your account.</p><ol>'+
    steps().map(function(s,i){return '<li><span class="n">'+(i+1)+'</span><span class="t">'+s[1]+'</span>'+(s[0]?'<span class="i">'+s[0]+'</span>':'')+'</li>'}).join("")+
    '</ol><button type="button" class="inst-ok">Got it</button></div>';
  document.body.appendChild(sheet);
  sheet.addEventListener("click",function(e){if(e.target===sheet||e.target.closest(".inst-ok"))closeSheet()});
}
function install(){
  if(prompt){var p=prompt;prompt=null;hide();try{p.prompt();if(p.userChoice)p.userChoice.then(function(){},function(){})}catch(e){openSheet()}}
  else openSheet();
}
function hide(){if(el){el.remove();el=null}}
function dismiss(){set(KEY,String(Date.now()));hide()}
function show(){
  if(el||standalone()||muted()||!can())return;
  if(document.documentElement.classList.contains("auth-open")||sheet){setTimeout(show,2500);return}
  el=document.createElement("div");el.className="inst-bar";el.setAttribute("role","region");el.setAttribute("aria-label","Install the app");
  el.innerHTML='<span class="ic" aria-hidden="true"></span><span class="tx"><b>Put AETHER Gym on your home screen</b><small>'+(prompt?"One tap to install. Opens full screen like an app.":"Opens full screen like an app. Takes two taps.")+'</small></span><button type="button" class="go">'+(prompt?"Install":"Show me")+'</button><button type="button" class="x" aria-label="Not now">&times;</button>';
  document.body.appendChild(el);
  el.querySelector(".go").addEventListener("click",install);
  el.querySelector(".x").addEventListener("click",dismiss);
}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();prompt=e;if(el){hide()}setTimeout(show,300)});
window.addEventListener("appinstalled",function(){prompt=null;hide();closeSheet()});
/* the first time someone signs in on an Apple device, show the steps straight away (once per device) */
function firstRun(){
  if(standalone()||!(ios||macSafari)||get(SEEN))return;
  if(document.documentElement.classList.contains("auth-open")){setTimeout(firstRun,1500);return}
  set(SEEN,"1");set(KEY,String(Date.now()));hide();openSheet();
}
window.AETHER_INSTALL={can:can,open:install,firstRun:firstRun};
addEventListener("load",function(){setTimeout(show,4000)});

/* a newer version of the app has been uploaded */
window.AETHER_UPDATE=function(){
  if(document.querySelector(".upd-bar"))return;
  var b=document.createElement("div");b.className="upd-bar";b.setAttribute("role","status");
  b.innerHTML='<span>A new version is ready.</span><button type="button">Refresh</button>';
  document.body.appendChild(b);b.querySelector("button").addEventListener("click",function(){location.reload()});
};
if("serviceWorker" in navigator){
  var had=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange",function(){if(had)window.AETHER_UPDATE();had=true});
}
})();
