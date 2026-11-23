/* AETHER Gym backend: sign-in plus saved data, using Supabase.
   The Gym page was written against a small "database" interface (doc / collection / onSnapshot / set / delete) plus
   photo uploads. This file provides exactly that on top of Supabase, so the Gym itself needs no changes.
   If config.js has no Supabase details, nothing here runs and the Gym saves to the browser only. */
(function(){
"use strict";
var cfg=window.AETHER_CONFIG||{};
var configured=cfg.supabaseUrl&&cfg.supabaseKey&&!/^YOUR_/.test(cfg.supabaseUrl)&&!/^YOUR_/.test(cfg.supabaseKey);
if(!configured||!window.supabase||!window.supabase.createClient)return;

var T="gym_docs",BUCKET="gym-photos";
var sb=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
var user=null,ready=null,resolveReady=null,recovery=false;
ready=new Promise(function(r){resolveReady=r});

function wrap(e){
  var m=(e&&e.message)||String(e||"");var err=new Error(m||"Couldn't save.");
  err.code=/failed to fetch|network|load failed|timeout|fetch/i.test(m)?"unavailable":(e&&e.code)||"error";
  return err;
}

/* ---------- sign-in screen ---------- */
var ov=null;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function showAuth(mode){
  if(!ov){ov=document.createElement("div");ov.className="auth-ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label","Sign in");document.body.appendChild(ov)}
  document.documentElement.classList.add("auth-open");
  var titles={signin:"Welcome back",signup:"Create your account",reset:"Reset your password",newpw:"Choose a new password"};
  var subs={signin:"Sign in to see your training.",signup:"Your sessions are saved to your account and follow you to any device.",reset:"We will email you a link to set a new password.",newpw:"Enter a new password for your account."};
  var btn={signin:"Sign in",signup:"Create account",reset:"Send reset link",newpw:"Save password"}[mode];
  var h='<form class="auth-card" novalidate>'+
    '<div class="auth-logo" aria-hidden="true"><svg viewBox="0 0 48 48"><g transform="rotate(-36 24 24)"><rect x="3.5" y="19" width="5" height="10" rx="2.5" fill="#fff" fill-opacity=".72"/><rect x="9" y="14" width="6.6" height="20" rx="3.3" fill="#fff"/><rect x="15" y="21.8" width="18" height="4.4" rx="2.2" fill="#fff" fill-opacity=".86"/><rect x="32.4" y="14" width="6.6" height="20" rx="3.3" fill="#fff"/><rect x="39.5" y="19" width="5" height="10" rx="2.5" fill="#fff" fill-opacity=".72"/></g></svg></div>'+
    '<h1>'+titles[mode]+'</h1><p class="auth-sub">'+subs[mode]+'</p>';
  if(mode!=="newpw")h+='<label>Email<input type="email" name="email" autocomplete="email" inputmode="email" autocapitalize="none" required></label>';
  if(mode!=="reset")h+='<label>Password<input type="password" name="password" autocomplete="'+(mode==="signin"?"current-password":"new-password")+'" minlength="8" required></label>';
  h+='<p class="auth-msg" role="status" aria-live="polite" hidden></p><button type="submit" class="auth-go">'+btn+'</button><div class="auth-alt">';
  if(mode==="signin")h+='<button type="button" data-m="reset">Forgot password?</button><button type="button" data-m="signup">Create an account</button>';
  else if(mode==="signup"||mode==="reset")h+='<button type="button" data-m="signin">I already have an account</button>';
  h+='</div></form>';
  ov.innerHTML=h;
  var f=ov.querySelector("form"),msg=ov.querySelector(".auth-msg"),go=ov.querySelector(".auth-go");
  function say(t,bad){msg.hidden=!t;msg.textContent=t||"";msg.className="auth-msg"+(bad?" bad":"")}
  ov.querySelectorAll("[data-m]").forEach(function(b){b.addEventListener("click",function(){showAuth(b.getAttribute("data-m"))})});
  f.addEventListener("submit",function(ev){
    ev.preventDefault();
    var em=f.email?f.email.value.trim():"",pw=f.password?f.password.value:"";
    if(mode!=="newpw"&&!/^\S+@\S+\.\S+$/.test(em)){say("Enter a valid email address.",true);return}
    if(mode!=="reset"&&pw.length<8){say("Use at least 8 characters for the password.",true);return}
    go.disabled=true;say("Please wait…");
    var back=location.origin+location.pathname;
    var p;
    if(mode==="signin")p=sb.auth.signInWithPassword({email:em,password:pw});
    else if(mode==="signup")p=sb.auth.signUp({email:em,password:pw,options:{emailRedirectTo:back}});
    else if(mode==="reset")p=sb.auth.resetPasswordForEmail(em,{redirectTo:back});
    else p=sb.auth.updateUser({password:pw});
    p.then(function(r){
      if(r.error){go.disabled=false;say(/invalid login/i.test(r.error.message)?"That email and password do not match.":r.error.message,true);return}
      if(mode==="signup"&&!(r.data&&r.data.session)){go.disabled=false;say("Check your email for a confirmation link, then come back and sign in.");return}
      if(mode==="reset"){go.disabled=false;say("If that email has an account, a reset link is on its way.");return}
      if(mode==="newpw"){recovery=false;sb.auth.getSession().then(function(x){signedIn(x.data&&x.data.session)});return}
    }).catch(function(e){go.disabled=false;say(wrap(e).message,true)});
  });
  var first=f.querySelector("input");if(first&&matchMedia("(pointer:fine)").matches)first.focus();
}
function hideAuth(){if(ov){ov.remove();ov=null}document.documentElement.classList.remove("auth-open")}

function signedIn(session){
  if(!session||!session.user)return;
  if(recovery)return;
  hideAuth();
  if(!user){user=session.user;resolveReady(user);setTimeout(function(){if(window.AETHER_INSTALL)AETHER_INSTALL.firstRun()},1500)}
}
sb.auth.onAuthStateChange(function(ev,session){
  if(ev==="PASSWORD_RECOVERY"){recovery=true;showAuth("newpw");return}
  if(ev==="SIGNED_IN"||ev==="TOKEN_REFRESHED"||ev==="INITIAL_SESSION"){if(session)signedIn(session)}
  if(ev==="SIGNED_OUT"&&user)location.reload();
});
sb.auth.getSession().then(function(r){
  var s=r.data&&r.data.session;
  if(s&&!recovery)signedIn(s);else if(!s&&!recovery&&!user)showAuth("signin");
});

/* ---------- the database interface the Gym expects ---------- */
var listeners=new Set(),channel=null;
function ensureChannel(){
  if(channel)return;
  channel=sb.channel("gym-"+user.id).on("postgres_changes",{event:"*",schema:"public",table:T,filter:"user_id=eq."+user.id},function(p){
    var path=(p.new&&p.new.path)||(p.old&&p.old.path)||null;
    listeners.forEach(function(l){l.hit(path)});
  }).subscribe();
}
function refreshAll(){listeners.forEach(function(l){l.refresh()})}
document.addEventListener("visibilitychange",function(){if(!document.hidden)refreshAll()});
window.addEventListener("online",refreshAll);

var urls={};
function assetPath(id){return user.id+"/"+id+".jpg"}
function resolveUrls(ids){
  var need=ids.filter(function(id){return !urls[id]||urls[id].exp<Date.now()+6e5});
  if(!need.length)return Promise.resolve();
  return sb.storage.from(BUCKET).createSignedUrls(need.map(assetPath),86400).then(function(r){
    if(r.error||!r.data)return;
    r.data.forEach(function(x,i){if(x&&x.signedUrl)urls[need[i]]={u:x.signedUrl,exp:Date.now()+864e5-6e5}});
  }).catch(function(){});
}
window.AETHER_ASSET_URL=function(id){return urls[id]?urls[id].u:""};

function strip(path){var m=/^data\/users\/[^/]+\/(.+)$/.exec(path);return m?m[1]:path}
function docSnap(path,data){return {id:path.split("/").pop(),exists:data!=null,data:function(){return data},metadata:{fromCache:false}}}
function mkDoc(p0){
  var path=strip(p0);
  return {
    id:path.split("/").pop(),
    get:function(){return sb.from(T).select("data").eq("path",path).maybeSingle().then(function(r){if(r.error)throw wrap(r.error);return docSnap(path,r.data?r.data.data:null)})},
    set:function(obj){return sb.from(T).upsert({user_id:user.id,path:path,data:obj,updated_at:new Date().toISOString()},{onConflict:"user_id,path"}).then(function(r){if(r.error)throw wrap(r.error)},function(e){throw wrap(e)})},
    delete:function(){return sb.from(T).delete().eq("user_id",user.id).eq("path",path).then(function(r){if(r.error)throw wrap(r.error)},function(e){throw wrap(e)})},
    collection:function(name){return mkCol(path+"/"+name)},
    onSnapshot:function(cb,fail){return listen(path,false,cb,fail)}
  };
}
function mkCol(prefix){
  return {doc:function(id){return mkDoc(prefix+"/"+id)},onSnapshot:function(cb,fail){return listen(prefix,true,cb,fail)}};
}
function listen(path,isCol,cb,fail){
  var busy=false,again=false,dead=false;
  function refresh(){
    if(dead)return;
    if(busy){again=true;return}
    busy=true;
    var q=sb.from(T).select("path,data");
    q=isCol?q.like("path",path+"/%"):q.eq("path",path);
    q.then(function(r){
      if(r.error)throw wrap(r.error);
      var rows=r.data||[];
      if(!isCol){if(!dead)cb(docSnap(path,rows.length?rows[0].data:null));return}
      var docs=rows.map(function(x){return {id:x.path.split("/").pop(),data:function(){return x.data}}});
      var ids=[];docs.forEach(function(d){var a=d.data()&&d.data().asset;if(typeof a==="string")ids.push(a)});
      return resolveUrls(ids).then(function(){if(!dead)cb({docs:docs,metadata:{fromCache:false}})});
    }).catch(function(e){if(!dead&&fail)fail(wrap(e))}).then(function(){busy=false;if(again){again=false;refresh()}});
  }
  var l={refresh:refresh,hit:function(p){if(!p||(isCol?p.indexOf(path+"/")===0:p===path))refresh()}};
  listeners.add(l);ensureChannel();refresh();
  return function(){dead=true;listeners.delete(l)};
}

var assets={
  upload:function(blob,opts){
    var id="a"+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
    return sb.storage.from(BUCKET).upload(assetPath(id),blob,{contentType:(opts&&opts.type)||"image/jpeg",upsert:false}).then(function(r){
      if(r.error)throw wrap(r.error);
      return resolveUrls([id]);
    }).then(function(){return {id:id}},function(e){throw wrap(e)});
  },
  "delete":function(id){return sb.storage.from(BUCKET).remove([assetPath(id)]).then(function(){delete urls[id]})}
};

window.claude={use:function(name){
  return ready.then(function(){
    if(name==="db")return {doc:mkDoc};
    if(name==="user")return {id:function(){return Promise.resolve(user.id)},email:function(){return Promise.resolve(user.email||"")}};
    if(name==="assets")return assets;
    throw new Error("Unknown capability "+name);
  });
}};

/* ---------- account button in the top bar ---------- */
window.AETHER_ACCOUNT={mount:function(){
  ready.then(function(){
    var n=0,t=setInterval(function(){
      var bar=document.querySelector(".hub-top-r");
      if(!bar&&++n<60)return;
      clearInterval(t);if(!bar)return;
      var b=document.createElement("button");b.type="button";b.className="hub-ibtn acct-btn";b.title="Account";b.setAttribute("aria-label","Account");b.setAttribute("aria-haspopup","true");
      b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.2" r="3.6"/><path d="M4.6 20c.9-3.7 3.8-5.6 7.4-5.6s6.5 1.9 7.4 5.6"/></svg>';
      bar.insertBefore(b,bar.querySelector(".hub-clock"));
      var pop=null;
      function close(){if(pop){pop.remove();pop=null}document.removeEventListener("click",out,true)}
      function out(e){if(pop&&!pop.contains(e.target)&&e.target!==b&&!b.contains(e.target))close()}
      b.addEventListener("click",function(){
        if(pop){close();return}
        pop=document.createElement("div");pop.className="acct-pop";
        var inst=window.AETHER_INSTALL&&AETHER_INSTALL.can();
        pop.innerHTML='<small>Signed in as</small><b>'+esc(user.email||"")+'</b>'+(inst?'<button type="button" class="acct-inst">Add to home screen</button>':'')+'<button type="button" class="acct-out">Sign out</button>';
        if(inst)pop.querySelector(".acct-inst").addEventListener("click",function(){close();AETHER_INSTALL.open()});
        document.body.appendChild(pop);
        pop.querySelector(".acct-out").addEventListener("click",function(){this.disabled=true;sb.auth.signOut().then(function(){location.reload()})});
        setTimeout(function(){document.addEventListener("click",out,true)},0);
      });
    },100);
  });
}};
})();
