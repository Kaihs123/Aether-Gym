/* AETHER themes.
   Each theme is a handful of colours: background, cards, text, secondary text and a three-stop accent gradient, plus light or dark mode.
   Everything else (lines, glass, shadows, soft accents, the background wash) is worked out from those, so a theme can be edited with a few pickers.
   Built-in themes never change: editing one saves your own copy. Your choice and your themes are kept in this browser and,
   when you're signed in, in this page's private storage so they follow you to other devices. */
(function(){
"use strict";
var H=window.AETHER;if(!H)return;
var esc=H.esc,G=window.AETHER_GLYPHS||{};
var KEY="aether-theme",DOCNAME="theme";

var PRESETS=[
  {id:"terminal",name:"Terminal",mode:"dark",design:"terminal",bg:"#0a0f16",card:"#0e1520",ink:"#f2f5fa",muted:"#8592a4",a1:"#22c47e",a2:"#3aa0e8",a3:"#e8a93a"},
  {id:"aether",name:"Aether",mode:"light",bg:"#f3f4fa",card:"#ffffff",ink:"#161936",muted:"#5a6087",a1:"#4f8cff",a2:"#7a5cff",a3:"#e35cbc"},
  {id:"aether-dark",name:"Aether Night",mode:"dark",bg:"#0f1120",card:"#191c31",ink:"#eceefe",muted:"#9ba1c8",a1:"#5b9bff",a2:"#8f74ff",a3:"#ef6cc8"},
  {id:"midnight",name:"Midnight",mode:"dark",bg:"#0a1018",card:"#121b27",ink:"#e6eef7",muted:"#8fa3b8",a1:"#2dd4bf",a2:"#38bdf8",a3:"#818cf8"},
  {id:"graphite",name:"Graphite",mode:"dark",bg:"#141414",card:"#1f1f21",ink:"#f2f2f3",muted:"#a1a1aa",a1:"#a3e635",a2:"#34d399",a3:"#22d3ee"},
  {id:"ocean",name:"Ocean",mode:"light",bg:"#eef5f8",card:"#ffffff",ink:"#0f2a3a",muted:"#4f6b7c",a1:"#06b6d4",a2:"#0ea5e9",a3:"#6366f1"},
  {id:"sunset",name:"Sunset",mode:"light",bg:"#fbf3ee",card:"#ffffff",ink:"#2a1a17",muted:"#7a5f57",a1:"#f59e0b",a2:"#f97362",a3:"#ec4899"},
  {id:"sage",name:"Sage",mode:"light",bg:"#f1f4ef",card:"#ffffff",ink:"#1b261d",muted:"#5d6e5f",a1:"#84cc16",a2:"#22a06b",a3:"#0d9488"},
  {id:"sky",name:"Sky",mode:"light",bg:"#f0f6ff",card:"#ffffff",ink:"#0b1f3d",muted:"#4a6283",a1:"#60a5fa",a2:"#2563eb",a3:"#7c3aed"},
  {id:"lavender",name:"Lavender",mode:"light",bg:"#f5f2fb",card:"#ffffff",ink:"#221a3a",muted:"#6a5f85",a1:"#a78bfa",a2:"#8b5cf6",a3:"#d946ef"},
  {id:"rose",name:"Rose",mode:"light",bg:"#fbf1f3",card:"#ffffff",ink:"#2b1520",muted:"#7d5866",a1:"#fb7185",a2:"#e11d48",a3:"#f59e0b"},
  {id:"mint",name:"Mint",mode:"light",bg:"#eef8f4",card:"#ffffff",ink:"#10291f",muted:"#4d6e60",a1:"#34d399",a2:"#059669",a3:"#0ea5e9"},
  {id:"sand",name:"Sand",mode:"light",bg:"#f6f1e8",card:"#fffdf8",ink:"#2b2418",muted:"#75694f",a1:"#f59e0b",a2:"#c2410c",a3:"#a16207"},
  {id:"citrus",name:"Citrus",mode:"light",bg:"#fafaee",card:"#ffffff",ink:"#23240f",muted:"#6a6b4a",a1:"#eab308",a2:"#65a30d",a3:"#ea580c"},
  {id:"paper",name:"Paper",mode:"light",bg:"#f4f4f5",card:"#ffffff",ink:"#18181b",muted:"#63636b",a1:"#71717a",a2:"#3f3f46",a3:"#18181b"},
  {id:"nebula",name:"Nebula",mode:"dark",bg:"#15111f",card:"#201a2e",ink:"#f1ecff",muted:"#a99cc8",a1:"#c084fc",a2:"#a855f7",a3:"#f472b6"},
  {id:"ember",name:"Ember",mode:"dark",bg:"#17110e",card:"#231a15",ink:"#fbeee6",muted:"#bba293",a1:"#fb923c",a2:"#f97316",a3:"#ef4444"},
  {id:"forest",name:"Forest",mode:"dark",bg:"#0d1612",card:"#15221b",ink:"#e7f3ec",muted:"#94b3a2",a1:"#4ade80",a2:"#16a34a",a3:"#a3e635"},
  {id:"ruby",name:"Ruby",mode:"dark",bg:"#170d11",card:"#22141a",ink:"#fbe9ef",muted:"#c09aa8",a1:"#fb7185",a2:"#e11d48",a3:"#c084fc"},
  {id:"nord",name:"Nord",mode:"dark",bg:"#2e3440",card:"#3b4252",ink:"#eceff4",muted:"#b3bccd",a1:"#88c0d0",a2:"#5e81ac",a3:"#b48ead"},
  {id:"noir-gold",name:"Noir Gold",mode:"dark",bg:"#12110e",card:"#1c1a15",ink:"#f6f0e1",muted:"#b3a98f",a1:"#f59e0b",a2:"#b45309",a3:"#d97706"},
  {id:"true-black",name:"True Black",mode:"dark",bg:"#000000",card:"#0e0e10",ink:"#f5f5f7",muted:"#9a9aa2",a1:"#0a84ff",a2:"#5e5ce6",a3:"#bf5af2"}
];
/* Logo choices for the top of the sidebar. "classic" is the original mark, "none" hides the mark and leaves just the name. */
var CLASSIC=G.logo;
function lg(inner){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision" aria-hidden="true">'+inner+'</svg>'}
var LOGOS=[
  {id:"classic",name:"Classic",svg:CLASSIC},
  {id:"orbit",name:"Orbit",svg:lg('<ellipse cx="12" cy="12" rx="9" ry="3.9" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="3.1" fill="currentColor" stroke="none"/><circle cx="18.4" cy="8.4" r="1.5" fill="currentColor" stroke="none"/>')},
  {id:"hex",name:"Hex",svg:lg('<path d="M12 3.2 19.6 7.6v8.8L12 20.8l-7.6-4.4V7.6z"/><path d="m12 8.4 3.4 2v3.8L12 16.2l-3.4-2v-3.8z" fill="currentColor" stroke="none" opacity=".55"/>')},
  {id:"waves",name:"Waves",svg:lg('<path d="M3 8.2c3-3 6-3 9 0s6 3 9 0"/><path d="M3 13c3-3 6-3 9 0s6 3 9 0"/><path d="M3 17.8c3-3 6-3 9 0s6 3 9 0"/>')},
  {id:"spark",name:"Spark",svg:lg('<path d="M12 3c.8 4.6 3.4 7.2 9 9-5.6 1.8-8.2 4.4-9 9-.8-4.6-3.4-7.2-9-9 5.6-1.8 8.2-4.4 9-9z" fill="currentColor" stroke="none" opacity=".85"/>')},
  {id:"peaks",name:"Peaks",svg:lg('<path d="M3 19.2 9.4 7.4l4.2 7.4 2.3-3.8 5.1 8.2z"/><circle cx="17.4" cy="6.4" r="1.6" fill="currentColor" stroke="none"/>')},
  {id:"none",name:"None",svg:CLASSIC}
];
var ICONS=[["solid","Solid","Coloured tiles, white icons"],["soft","Soft","Tinted tiles, coloured icons"],["outline","Outline","Light tiles with a coloured edge"],["mono","Mono","Plain tiles in your text colour"]];
var FIELDS=[["bg","Background"],["card","Cards and bars"],["ink","Main text"],["muted","Secondary text"],["a1","Accent start"],["a2","Accent middle"],["a3","Accent end"]];

/* ---------- colour maths ---------- */
function hex(h){h=String(h||"").trim().replace(/^#/,"");if(h.length===3)h=h.replace(/./g,"$&$&");return /^[0-9a-f]{6}$/i.test(h)?"#"+h.toLowerCase():null}
function rgb(h){h=hex(h)||"#000000";return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function toHex(c){return "#"+c.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return(v<16?"0":"")+v.toString(16)}).join("")}
function mix(a,b,t){var x=rgb(a),y=rgb(b);return toHex([0,1,2].map(function(i){return x[i]+(y[i]-x[i])*t}))}
function rgba(h,a){var c=rgb(h);return "rgba("+c[0]+","+c[1]+","+c[2]+","+a+")"}
function lum(h){var c=rgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}

function ratio(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
/* colour c made readable as text on background b: nudged toward the ink colour until it reaches the contrast asked for */
function readable(c,b,ink,min){var out=c;for(var i=0;i<12&&ratio(out,b)<min;i++)out=mix(out,ink,.12);return out}
/* a solid fill for buttons and switches: the accent, deepened until white text reads well on it; a very pale accent keeps its colour and gets dark text */
function fill(c){var f=c;for(var i=0;i<6&&ratio("#ffffff",f)<4.5;i++)f=mix(f,"#000000",.08);return ratio("#ffffff",f)>=4.5?[f,"#ffffff"]:[c,mix(c,"#000000",.72)]}

function vars(t){
  var dk=t.mode==="dark",bg=t.bg,card=t.card,ink=t.ink,mu=t.muted,a1=t.a1,a2=t.a2,a3=t.a3;
  var accent=readable(a2,card,ink,4.5),btn=fill(a2);
  var v={
    "--bg":bg,"--card":card,"--ink":ink,"--ink-2":mix(ink,mu,.35),"--muted":mu,"--faint":mix(mu,bg,.35),
    "--sub":rgba(ink,dk?.06:.04),"--line":rgba(ink,dk?.1:.08),"--line-2":rgba(ink,dk?.2:.15),"--hover":rgba(ink,dk?.07:.05),
    "--field":dk?mix(card,ink,.05):card,
    "--accent":accent,"--accent-soft":rgba(a2,dk?.2:.1),"--btn":btn[0],"--btn-ink":btn[1],
    "--a1":a1,"--a2":a2,"--a3":a3,
    "--positive":t.design==="terminal"?"#22c47e":dk?"#3fd3a2":"#0b8566","--negative":t.design==="terminal"?"#f0465f":dk?"#ff6f8a":"#c4344f","--warn":t.design==="terminal"?"#e8a93a":dk?"#f2b552":"#9c5c08",
    "--pop":dk?"0 16px 40px -12px rgba(0,0,0,.7),0 0 0 1px "+rgba(ink,.06):"0 16px 40px -12px "+rgba(ink,.28)+",0 2px 6px "+rgba(ink,.06)
  };
  var css="html:root{"+Object.keys(v).map(function(k){return k+":"+v[k]}).join(";")+";color-scheme:"+(dk?"dark":"light")+"}";
  /* the hub's and Wealth's own tint follow the theme accent; Gym keeps its coral */
  var tg="linear-gradient(140deg,"+mix(a1,"#ffffff",.2)+" 0%,"+mix(a2,"#ffffff",.15)+" 50%,"+mix(a3,"#ffffff",.2)+" 100%)";
  var on=lum(mix(a2,"#ffffff",.15))>.45?mix(a2,"#000000",.65):"#ffffff";
  css+='html [data-tint="hub"]{--tint-on:'+on+';--tint:'+a2+';--tint-ink:'+accent+';--tint-soft:'+rgba(a2,dk?.18:.11)+';--tint-grad:'+tg+';--tint-fill:'+btn[0]+';--tint-fill-ink:'+btn[1]+'}';
  /* Wealth is green and Weather is violet in every theme, so the sidebar is not mostly blue */
  css+='html [data-tint="wealth"]{--tint:#1fae6b;--tint-ink:'+(dk?'#4fd68f':'#0b7a4b')+';--tint-soft:rgba(31,174,107,'+(dk?.2:.12)+');--tint-grad:linear-gradient(140deg,#9af0b8 0%,#4cd08a 50%,#2bb3a0 100%);--tint-fill:#0b7a4b;--tint-fill-ink:#fff}';
  css+='html [data-tint="sky"]{--tint:#8b5cf6;--tint-ink:'+(dk?'#b9a3ff':'#6d3fe0')+';--tint-soft:rgba(139,92,246,'+(dk?.2:.12)+');--tint-grad:linear-gradient(140deg,#cdbcff 0%,#a283f7 50%,#7c5ce6 100%);--tint-fill:#6d3fe0;--tint-fill-ink:#fff}';
  if(dk){
    css+='html [data-tint="gym"]{--tint-ink:#ff8f7d;--tint-soft:rgba(242,103,95,.18)}html [data-tint="mint"]{--tint-ink:#4fd6bd;--tint-soft:rgba(22,163,137,.2)}html [data-tint="sun"]{--tint-ink:#f0b25a;--tint-soft:rgba(240,160,40,.2)}';
    css+='html .app-wealth{--edge:'+rgba(ink,.12)+';--c-left:'+mix(card,ink,.2)+';--c-bills:'+mix(card,ink,.4)+'}';
  }
  return css;
}

/* The theme rules start with "html" so they win over the stylesheets wherever those sit in the page. */
/* ---------- state ---------- */
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var ST={icons:"solid",shape:"square",logo:"classic",brand:"show",sel:"terminal",custom:[],lastLight:"aether",lastDark:"terminal",at:0,d2:0};
function load(raw){try{var o=JSON.parse(raw||"null");if(o&&typeof o==="object"){ST.sel=o.sel||ST.sel;if(ICONS.some(function(x){return x[0]===o.icons}))ST.icons=o.icons;if(o.shape==="circle"||o.shape==="square")ST.shape=o.shape;if(LOGOS.some(function(x){return x.id===o.logo}))ST.logo=o.logo;if(o.brand==="show"||o.brand==="hide")ST.brand=o.brand;ST.custom=Array.isArray(o.custom)?o.custom.filter(valid):[];ST.lastLight=o.lastLight||ST.lastLight;ST.lastDark=o.lastDark||ST.lastDark;ST.at=+o.at||0;ST.d2=+o.d2||0}}catch(e){}}
function valid(t){if(t&&t.design&&t.design!=="terminal")delete t.design;return t&&t.id&&t.name&&FIELDS.every(function(f){return hex(t[f[0]])})&&(t.mode==="dark"||t.mode==="light")}
function all(){return PRESETS.concat(ST.custom)}
function byId(id){return all().find(function(t){return t.id===id})||PRESETS[0]}
function isPreset(id){return PRESETS.some(function(t){return t.id===id})}
function cur(){return byId(ST.sel)}
var logoCss=document.createElement("style");logoCss.textContent='html[data-logo="none"] .hub-brand .gicon,html[data-logo="none"] .hub-top-ic[data-tint="hub"]{display:none!important}html[data-brand="hide"] .hub-brand b{display:none}';document.head.appendChild(logoCss);
var styleEl=document.createElement("style");styleEl.id="hub-theme-vars";document.head.appendChild(styleEl);
function apply(){
  var t=cur();styleEl.textContent=vars(t);
  document.documentElement.setAttribute("data-mode",t.mode);
  document.documentElement.setAttribute("data-design",t.design||"classic");
  document.documentElement.setAttribute("data-icons",ST.icons);document.documentElement.setAttribute("data-icon-shape",ST.shape);
  var lgo=LOGOS.find(function(x){return x.id===ST.logo})||LOGOS[0];G.logo=lgo.svg;
  document.documentElement.setAttribute("data-logo",lgo.id==="none"?"none":"on");document.documentElement.setAttribute("data-brand",ST.brand);
  var bi=document.querySelector(".hub-brand .gicon");if(bi)bi.innerHTML=G.logo;
  var ti=document.getElementById("hub-top-ic"),tt=document.getElementById("hub-title");if(ti&&tt&&tt.textContent==="Overview")ti.innerHTML=G.logo;
  var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t.bg);
  var n=document.getElementById("hub-theme-name");if(n)n.textContent=t.name;
}
var cloud=null,pushT=null,lastPush=0;
function save(){
  ST.at=Date.now();
  var raw=JSON.stringify({icons:ST.icons,shape:ST.shape,logo:ST.logo,brand:ST.brand,sel:ST.sel,custom:ST.custom,lastLight:ST.lastLight,lastDark:ST.lastDark,at:ST.at,d2:ST.d2});
  LS.set(KEY,raw);
  if(cloud){clearTimeout(pushT);pushT=setTimeout(function(){lastPush=ST.at;try{cloud.set({json:raw,at:ST.at,v:1}).catch(function(){})}catch(e){}},500)}
}
function select(id){
  var t=byId(id);ST.sel=t.id;
  if(t.mode==="dark")ST.lastDark=t.id;else ST.lastLight=t.id;
  apply();save();
}
load(LS.get(KEY));
/* 18 Nov 2026: the Terminal design becomes the hub-wide look, once. Picking another theme afterwards sticks. */
function migrate(){if(ST.d2>=1)return false;ST.d2=1;ST.sel="terminal";ST.lastDark="terminal";return true}
var migNow=migrate();apply();if(migNow)save();

/* sync between devices when signed in */
if(H.cloud)H.cloud().then(function(c){
  if(!c)return;
  try{cloud=c.db.doc("data/users/"+c.uid+"/"+DOCNAME)}catch(e){return}
  var first=true;
  cloud.onSnapshot(function(snap){
    var d=snap.exists?snap.data():null,at=d?+d.at||0:0;
    if(first){first=false;if(!d||typeof d.json!=="string"){if(LS.get(KEY))save();return}if(ST.at>at){save();return}}
    if(d&&typeof d.json==="string"&&at>ST.at&&at!==lastPush){load(d.json);LS.set(KEY,d.json);if(migrate())save();apply();if(PANEL.open)render()}
  },function(){});
},function(){});

/* ---------- quick light/dark switch ---------- */
H.toggleMode=function(){
  var t=cur(),to=t.mode==="dark"?ST.lastLight:ST.lastDark;
  var target=byId(to);
  if(target.mode===t.mode)target=t.mode==="dark"?PRESETS[0]:PRESETS[1];
  select(target.id);
  if(PANEL.open)render();
};

/* ---------- appearance panel ---------- */
document.body.insertAdjacentHTML("beforeend",'<div class="hub-theme" id="hub-theme" role="dialog" aria-modal="true" aria-labelledby="hub-theme-h" hidden><div class="ht-box" id="ht-box"></div></div>');
var PANEL={open:false,back:null,draft:null,msg:""};
function swatch(t){
  return '<span class="ht-sw" aria-hidden="true" style="background:'+t.bg+'"><span style="background:'+t.card+';border-color:'+rgba(t.ink,.12)+'"><i style="background:'+t.ink+'"></i><i style="background:'+t.muted+';width:60%"></i><b style="background:linear-gradient(90deg,'+t.a1+','+t.a2+','+t.a3+')"></b></span></span>';
}
function card(t){
  var on=t.id===ST.sel;
  return '<button type="button" class="ht-card" data-pick="'+esc(t.id)+'" aria-pressed="'+on+'">'+swatch(t)+'<span class="ht-cn"><b>'+esc(t.name)+'</b><small>'+(t.mode==="dark"?"Dark":"Light")+(isPreset(t.id)?"":" · Yours")+'</small></span>'+(on?'<span class="ht-tick" aria-hidden="true">✓</span>':'')+'</button>';
}
function dyn(t,own){
  var cr=ratio(t.ink,t.card);
  return (cr<4.5?'<p class="ht-warn">Main text and cards are close in brightness ('+cr.toFixed(1)+':1), so words may be hard to read. Aim for 4.5:1 or more.</p>':'')+
    '<div class="ht-btns">'+
      (PANEL.draft?'<span class="ht-badge">Previewing your changes</span><button type="button" class="ht-btn primary" data-act="save">'+(own?"Save changes":"Save as my theme")+'</button><button type="button" class="ht-btn" data-act="discard">Discard</button>':'')+
      (own&&!PANEL.draft?'<button type="button" class="ht-btn" data-act="dup">Duplicate</button><button type="button" class="ht-btn danger" data-act="del">Delete theme</button>':'')+
      (!own&&!PANEL.draft?'<button type="button" class="ht-btn" data-act="dup">Make a copy to edit</button>':'')+
    '</div>'+
    (PANEL.msg?'<p class="ht-msg" role="status">'+esc(PANEL.msg)+'</p>':'');
}
function render(){
  var t=PANEL.draft||cur(),own=!isPreset(t.id),box=document.getElementById("ht-box");
  var light=all().filter(function(x){return x.mode==="light"}),dark=all().filter(function(x){return x.mode==="dark"});
  var fields=FIELDS.map(function(f){
    var k=f[0],v=hex(t[k]);
    return '<label class="ht-f"><span class="ht-cl"><input type="color" data-k="'+k+'" value="'+v+'" aria-label="'+f[1]+' colour"></span><span class="ht-fl"><b>'+f[1]+'</b><input type="text" class="ht-hex" data-hex="'+k+'" value="'+v+'" maxlength="7" spellcheck="false" aria-label="'+f[1]+' hex code"></span></label>';
  }).join("");
  box.innerHTML=
    '<header class="ht-head"><div><h2 id="hub-theme-h">Appearance</h2><p>Pick a theme, or edit the colours to make it yours.</p></div><button type="button" class="ht-x" data-act="close" aria-label="Close">×</button></header>'+
    '<div class="ht-body">'+
      '<div class="ht-mode" role="group" aria-label="Mode"><button type="button" data-act="light" aria-pressed="'+(t.mode==="light")+'">'+G.sun+'Light</button><button type="button" data-act="dark" aria-pressed="'+(t.mode==="dark")+'">'+G.moon+'Dark</button></div>'+
      '<h3>Logo</h3><div class="ht-icons ht-logos" role="group" aria-label="Logo">'+LOGOS.map(function(x){return '<button type="button" data-logo="'+x.id+'" aria-pressed="'+(ST.logo===x.id)+'"><span class="ht-ip">'+(x.id==="none"?'<small>–</small>':'<i class="gicon" data-tint="hub" style="--s:30px" aria-hidden="true">'+x.svg+'</i>')+'</span><b>'+x.name+'</b></button>'}).join('')+'</div>'+
      '<div class="ht-mode ht-shape" role="group" aria-label="Name"><button type="button" data-brand="show" aria-pressed="'+(ST.brand==="show")+'">Show AETHER name</button><button type="button" data-brand="hide" aria-pressed="'+(ST.brand==="hide")+'">Hide name</button></div>'+
      '<h3>Icon style</h3><div class="ht-icons" role="group" aria-label="Icon style">'+ICONS.map(function(x){return '<button type="button" data-icons="'+x[0]+'" aria-pressed="'+(ST.icons===x[0])+'"><span class="ht-ip" data-icons="'+x[0]+'" data-icon-shape="'+ST.shape+'">'+H.icon("wealth","wealth",30)+H.icon("gym","gym",30)+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></button>'}).join('')+'</div>'+
      '<div class="ht-mode ht-shape" role="group" aria-label="Icon shape"><button type="button" data-shape="square" aria-pressed="'+(ST.shape==="square")+'"><i class="sq"></i>Rounded square</button><button type="button" data-shape="circle" aria-pressed="'+(ST.shape==="circle")+'"><i class="ci"></i>Circle</button></div>'+
      '<h3>Light themes</h3><div class="ht-grid">'+light.map(card).join("")+'</div>'+
      '<h3>Dark themes</h3><div class="ht-grid">'+dark.map(card).join("")+'</div>'+
      '<section class="ht-edit"><div class="ht-eh"><h3>'+(own?"Edit "+esc(t.name):"Customise "+esc(t.name))+'</h3></div>'+
        (own?'':'<p class="ht-note">Built-in themes stay as they are. Change any colour and saving makes your own copy.</p>')+
        '<label class="ht-name"><span>Theme name</span><input type="text" id="ht-name" value="'+esc(PANEL.draft?PANEL.draft.name:own?t.name:t.name+" (mine)")+'" maxlength="28"></label>'+
        '<div class="ht-fields">'+fields+'</div>'+
        '<div id="ht-dyn">'+dyn(t,own)+'</div>'+
      '</section>'+
    '</div>';
}
function preview(){styleEl.textContent=vars(PANEL.draft||cur());document.documentElement.setAttribute("data-mode",(PANEL.draft||cur()).mode)}
function ensureDraft(){if(!PANEL.draft){var t=cur();PANEL.draft=Object.assign({},t,{name:isPreset(t.id)?t.name+" (mine)":t.name})}return PANEL.draft}
function uid(){return "my-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function act(a){
  PANEL.msg="";
  if(a==="close"){close();return}
  if(a==="light"||a==="dark"){
    if(PANEL.draft){PANEL.draft.mode=a;preview();render();return}
    var t=cur();if(t.mode===a)return;
    var to=byId(a==="dark"?ST.lastDark:ST.lastLight);if(to.mode!==a)to=a==="dark"?PRESETS[1]:PRESETS[0];
    select(to.id);render();return;
  }
  if(a==="discard"){PANEL.draft=null;apply();render();return}
  if(a==="save"){
    var d=PANEL.draft,nm=(document.getElementById("ht-name").value||"").trim()||"My theme";d.name=nm.slice(0,28);
    if(isPreset(d.id)){d.id=uid();ST.custom.push(d)}else{ST.custom=ST.custom.map(function(x){return x.id===d.id?d:x})}
    PANEL.draft=null;select(d.id);PANEL.msg="Saved “"+d.name+"”.";render();return;
  }
  if(a==="dup"){var c=Object.assign({},cur(),{id:uid(),name:(cur().name.replace(/ \(mine\)$/,""))+" (mine)"});ST.custom.push(c);select(c.id);PANEL.msg="Made a copy. Change any colour, then save.";render();return}
  if(a==="del"){
    var id=cur().id;if(isPreset(id))return;
    var gone=cur();ST.custom=ST.custom.filter(function(x){return x.id!==id});
    select(gone.mode==="dark"?(byId(ST.lastDark).id===id?PRESETS[1].id:ST.lastDark):(byId(ST.lastLight).id===id?PRESETS[0].id:ST.lastLight));
    PANEL.msg="Deleted “"+gone.name+"”.";render();return;
  }
}
function setColour(k,v){var h=hex(v);if(!h)return;var d=ensureDraft();d[k]=h;preview()}
function open(){
  if(PANEL.open)return;PANEL.open=true;PANEL.back=document.activeElement;PANEL.msg="";
  var p=document.getElementById("hub-theme");p.hidden=false;render();
  setTimeout(function(){var b=p.querySelector('.ht-card[aria-pressed="true"]')||p.querySelector("button");if(b)try{b.focus({preventScroll:true})}catch(e){}},30);
}
function close(){
  if(!PANEL.open)return;PANEL.open=false;
  if(PANEL.draft){PANEL.draft=null;apply()}
  document.getElementById("hub-theme").hidden=true;
  var b=PANEL.back;PANEL.back=null;if(b&&b.focus&&document.contains(b))try{b.focus({preventScroll:true})}catch(e){}
}
H.openTheme=open;
function keepScroll(fn){var b=document.getElementById("ht-box"),y=b?b.scrollTop:0;fn();if(b)b.scrollTop=y}
var panel=document.getElementById("hub-theme");
panel.addEventListener("pointerdown",function(e){if(e.target===panel)close()});
panel.addEventListener("click",function(e){
  var p=e.target.closest("[data-pick]");if(p){PANEL.draft=null;PANEL.msg="";select(p.getAttribute("data-pick"));render();var b=panel.querySelector('[data-pick="'+p.getAttribute("data-pick")+'"]');if(b)b.focus({preventScroll:true});return}
  var ic=e.target.closest("button[data-icons]");if(ic){ST.icons=ic.getAttribute("data-icons");apply();save();keepScroll(render);return}
  var lgb=e.target.closest("button[data-logo]");if(lgb){ST.logo=lgb.getAttribute("data-logo");apply();save();keepScroll(render);return}
  var bnb=e.target.closest("button[data-brand]");if(bnb){ST.brand=bnb.getAttribute("data-brand");apply();save();keepScroll(render);return}
  var sh=e.target.closest("button[data-shape]");if(sh){ST.shape=sh.getAttribute("data-shape");apply();save();keepScroll(render);return}
  var a=e.target.closest("[data-act]");if(a)act(a.getAttribute("data-act"));
});
panel.addEventListener("input",function(e){
  var t=e.target,k=t.getAttribute("data-k");
  if(k){setColour(k,t.value);var hx=panel.querySelector('[data-hex="'+k+'"]');if(hx)hx.value=t.value;markDraft();return}
  var hk=t.getAttribute("data-hex");
  if(hk){var h=hex(t.value);if(h){setColour(hk,h);var c=panel.querySelector('[data-k="'+hk+'"]');if(c)c.value=h;markDraft()}return}
  if(t.id==="ht-name"){ensureDraft().name=t.value;markDraft()}
});
/* the first edit switches the buttons to Save / Discard without losing the picker you're using */
function markDraft(){var t=PANEL.draft||cur(),el=document.getElementById("ht-dyn");if(el)el.innerHTML=dyn(t,!isPreset(t.id))}
document.addEventListener("keydown",function(e){if(PANEL.open&&e.key==="Escape"){e.preventDefault();e.stopPropagation();close()}},true);

H.cmds.push(
  {key:"cmd:theme",label:"Appearance",sub:"Themes, colours and dark mode",glyph:"grid",tag:"Settings",kw:"icons icon style theme themes colour color colours dark mode light night appearance customise",run:open},
  {key:"cmd:mode",label:"Switch light / dark mode",sub:"Appearance",glyph:"grid",tag:"Settings",kw:"dark mode light night toggle theme",run:function(){H.toggleMode()}}
);
})();
