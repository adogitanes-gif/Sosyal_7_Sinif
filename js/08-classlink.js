"use strict";
/* Grade 7 games · class link (shared by Matematik 7, Fen 7, Peygamberimizin Hayatı 7, English 7 and the teacher panel).
   No server: the student's name/class are entered once and shared by all games (same web address = same storage);
   reports travel as a link the student sends (WhatsApp / BiP / e-mail); the teacher's note comes back as a link.
   The part after "#" in a link is never sent to any server. */
const CL={
  PANEL:'https://adogitanes-gif.github.io/Ogretmen_7/',
  GAMES:{m7:{name:'Matematik 7',tr:'Matematik',url:'https://adogitanes-gif.github.io/Matematik_7_Sinif/'},
         f7:{name:'Fen Bilimleri 7',tr:'Fen Bilimleri',url:'https://adogitanes-gif.github.io/Fen_7_Sinif/'},
         p7:{name:'Peygamberimizin Hayatı 7',tr:'Peygamberimizin Hayatı',url:'https://adogitanes-gif.github.io/Peygamber_7_Sinif/'},
         e7:{name:'English 7',tr:'İngilizce',url:'https://adogitanes-gif.github.io/English_7_Sinif/'},
         s7:{name:'Sosyal Bilgiler 7',tr:'Sosyal Bilgiler',url:'https://adogitanes-gif.github.io/Sosyal_7_Sinif/'}},
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  h(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')},
  /* text <-> link-safe code */
  enc(o){const s=JSON.stringify(o);return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},
  dec(c){try{c=String(c).replace(/-/g,'+').replace(/_/g,'/');while(c.length%4)c+='=';return JSON.parse(decodeURIComponent(escape(atob(c))))}catch(e){return null}},
  /* a light seal: stops casual editing of a report by hand (not real security) */
  seal(o){const s=JSON.stringify(o)+'·g7';let x=0x811c9dc5;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)>>>0}return x.toString(36)},
  pack(o){return CL.enc({...o,z:CL.seal(o)})},
  unpack(c){const o=CL.dec(c);if(!o||!o.z)return null;const {z,...rest}=o;return CL.seal(rest)===z?rest:null},
  /* names */
  cap(s){return String(s||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('tr').replace(/(^|[\s-])(\S)/g,(m,a,b)=>a+b.toLocaleUpperCase('tr'))},
  normClass(s){const m=String(s||'').trim().toLocaleUpperCase('tr').match(/^(\d{1,2})\s*[-/.\s]?\s*([A-ZÇĞİÖŞÜ])$/);return m?m[1]+'-'+m[2]:null},
  student(){return CL.get('g7-student',null)},
  parent(){const p=CL.get('g7-parent',{});return {father:p.father||p.phone||'',mother:p.mother||'',email:p.email||''}},
  intl(t){let d=String(t||'').replace(/\D/g,'');if(/^0\d{10}$/.test(d))d='9'+d;else if(/^5\d{9}$/.test(d))d='90'+d;return d},
  phones(c,en){return [[en?'Father':'Baba',c.father],[en?'Mother':'Anne',c.mother]].filter(x=>x[1]&&String(x[1]).trim())},
  okPhone(t){const d=String(t||'').replace(/\D/g,'');return !d||/^(0?5\d{9}|905\d{9})$/.test(d)},
  okMail(t){t=String(t||'').trim();return !t||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t)},
  full(st){return st?`${st.n} ${st.s}`:''},
  key(st){return (st.c+'|'+st.n+' '+st.s).toLocaleLowerCase('tr')},
  date(t){try{return new Date(t).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric'})}catch(e){return ''}},
  pct(a,b){return b?Math.round(a/b*100):0},
  cut(t,n){t=String(t||'');if(t.length<=n)return t;const c=t.slice(0,n-1),i=c.lastIndexOf(' ');return (i>n*.6?c.slice(0,i):c)+'…'},

  /* ===== the Turkish parent message (used by the games and by the teacher panel) ===== */
  parentMessage(st,games,o={}){
    const ids=Object.keys(games||{}).filter(k=>games[k]&&CL.GAMES[k]);const L=[];
    const w=ids.map(k=>games[k].wk||{n:0,ok:0,days:0}),wn=w.reduce((a,x)=>a+x.n,0),wok=w.reduce((a,x)=>a+x.ok,0),wd=Math.max(0,...w.map(x=>x.days||0));
    L.push(`Sayın Veli,`);
    L.push(`${CL.full(st)} (${st.c}) için uygulama özeti${o.date?` (${o.date})`:''}:`);
    if(wn)L.push(`📅 Son 7 gün: ${wd} gün çalıştı, ${wn} soru çözdü, doğruluk %${CL.pct(wok,wn)}.`);
    else L.push(`📅 Son 7 günde uygulamalarda çalışma görünmüyor.`);
    ids.forEach(k=>{const g=games[k];L.push(`• ${CL.GAMES[k].tr}: ${g.done}/${g.less} ders tamamlandı, genel doğruluk %${CL.pct(g.ok,g.n)}${g.streak?`, ${g.streak} gün üst üste görev`:''}.`)});
    /* strongest unit (enough answers) */
    let best=null;ids.forEach(k=>(games[k].units||[]).forEach(u=>{if(u[3]>=8){const a=u[2]/u[3];if(!best||a>best.a)best={a,k,t:u[1]}}}));
    if(best&&best.a>=.75)L.push(`✅ Güçlü olduğu konu: ${CL.GAMES[best.k].tr} – ${best.t} (%${Math.round(best.a*100)}).`);
    /* what to work on */
    const todo=[];ids.forEach(k=>{const g=games[k];(g.weak||[]).slice(0,2).forEach(t=>todo.push(`${CL.GAMES[k].tr}: "${t}" dersini tekrar etmeli.`));
      if(k!=='e7')(g.mis||[]).slice(0,1).forEach(m=>{if(m[2])todo.push(`${CL.GAMES[k].tr} – sık yapılan hata (${m[0]}): ${m[2]}`)})});
    if(todo.length){L.push(`📌 Çalışması gerekenler:`);todo.slice(0,5).forEach(t=>L.push(`  - ${t}`))}
    /* reward */
    const gl=ids.map(k=>games[k].goal).filter(Boolean)[0];
    if(wd>=5)L.push(`🏆 Bu hafta ${wd} gün düzenli çalıştı; küçük bir ödülü ve takdiri hak ediyor.`);
    else if(wd>=3)L.push(`👍 Bu hafta ${wd} gün çalıştı. Haftada 5 güne çıkarsa bir ödül sözü verebilirsiniz.`);
    if(gl&&gl.target){const left=Math.max(0,gl.target-gl.got),named=gl.reward&&!/^(aile ödülü|family reward)$/i.test(gl.reward.trim()),rw=named?`aile ödülüne ("${gl.reward}")`:'aile ödülü hedefine';L.push(left?`🎯 Uygulamadaki ${rw} ${left} altın kaldı.`:`🎉 Uygulamadaki ${rw} ulaştı; ödülü verme zamanı!`)}
    L.push(`💡 Öneri: Her gün yaklaşık 15 dakika "Bugünün Görevi"ni birlikte açın. Yanlış cevapta çıkan kısa açıklamayı birlikte okuyun ve doğrusunu ona anlattırın. Emeğini övün, sadece puanı değil.`);
    if(o.note)L.push(`📝 Öğretmen notu: ${o.note}`);
    L.push(o.sign||`— ${st.c} Sınıf Öğretmeni`);
    return L.join('\n')},

  /* ===== share window: Paylaş (BiP, WhatsApp… from the phone's list), WhatsApp, e-posta, kopyala ===== */
  share(o){const T=o.en?{share:'Share',copy:'Copy',close:'Close',mail:'E-mail',copied:'Copied!',bip:'For BiP: tap Share and choose BiP, or Copy and paste it.'}:
      {share:'Paylaş',copy:'Kopyala',close:'Kapat',mail:'E-posta',copied:'Kopyalandı!',bip:'BiP için: "Paylaş"a dokunup BiP\'i seçin ya da Kopyala ile BiP\'e yapıştırın.'};
    const ov=document.createElement('div');ov.className='ov cl-ov';ov.innerHTML=`<div class="pnl cl-pnl" role="dialog" aria-modal="true" aria-label="${CL.h(o.title)}">
      <h2 style="margin-top:0">${CL.h(o.title)}</h2>${o.intro?`<p class="hint">${o.intro}</p>`:''}
      <textarea class="cl-ta" rows="${o.rows||9}" ${o.edit?'':'readonly'}>${CL.h(o.text)}</textarea>
      <div class="row cl-btns">${navigator.share?`<button class="btn gold" data-a="share" type="button">📤 ${T.share}</button>`:''}
        ${(o.phones&&o.phones.length?o.phones:[['','']]).map((p,i)=>`<a class="btn" data-a="wa" data-i="${i}" target="_blank" rel="noopener">WhatsApp${p[0]?' · '+CL.h(p[0]):''}</a>`).join('')}<a class="btn" data-a="mail">✉️ ${T.mail}</a>
        <button class="btn" data-a="copy" type="button">📋 ${T.copy}</button><button class="btn" data-a="close" type="button">${T.close}</button></div>
      <p class="hint">${T.bip}</p></div>`;
    document.body.appendChild(ov);const ta=ov.querySelector('.cl-ta'),txt=()=>ta.value;
    const was=[...ov.querySelectorAll('[data-a=wa]')],ml=ov.querySelector('[data-a=mail]'),PH=(o.phones&&o.phones.length?o.phones:[['','']]).map(p=>CL.intl(p[1]));
    const upd=()=>{was.forEach((a,i)=>a.href=`https://wa.me/${PH[i]}?text=${encodeURIComponent(txt())}`);ml.href=`mailto:${encodeURIComponent(o.email||'')}?subject=${encodeURIComponent(o.subject||o.title)}&body=${encodeURIComponent(txt())}`};upd();ta.oninput=upd;
    ov.querySelector('[data-a=close]').onclick=()=>ov.remove();
    ov.querySelector('[data-a=copy]').onclick=async e=>{try{await navigator.clipboard.writeText(txt())}catch(_){ta.select();document.execCommand('copy')}e.target.textContent=T.copied};
    const sb=ov.querySelector('[data-a=share]');if(sb)sb.onclick=()=>navigator.share({title:o.subject||o.title,text:txt()}).catch(()=>{});
    ov.addEventListener('click',e=>{if(e.target===ov)ov.remove()});return ov}
};

/* ======================= inside a game ======================= */
if(typeof window!=='undefined'&&window.G7_GAME&&typeof LESSONS!=='undefined'){(function(){
  const GM=window.G7_GAME,PX=GM.id,EN=GM.lang==='en',T=EN?{
    who:'Who is playing?',whoHint:'Type your first name, surname and class once. All the games will remember it.',
    n:'First name',s:'Surname',c:'Class (e.g. 7-A)',save:'Save',bad:'Please write your first name, surname and class like 7-A.',
    edit:'Change name',send:'📤 Send to my teacher',sendT:'Send your report to your teacher',
    sendIntro:'Send this message to your teacher on WhatsApp, BiP or e-mail. Your teacher opens the link to see your progress.',
    note:'Message from your teacher',read:'Got it',forOther:'This message is for',parent:'👨‍👩‍👧 Send to parent (Turkish)',parentT:'Message for the parent (Turkish)',
    parentIntro:'A Turkish summary for the parent with advice and a reward idea. You can edit it before sending.',
    classPanel:'Teacher and parent',classHint:'Send your progress in all the games to your teacher, or a Turkish summary to your parent.',pf:'Father\'s phone (optional)',pm:'Mother\'s phone (optional)',pe:'Parent\'s e-mail (optional)',pHint:'Saved only on this device. Then WhatsApp and e-mail open straight to your parent.',pBad:'Please check the phone number (like 0532 123 45 67) and the e-mail.',pTo:'Goes straight to:',pNone:'Tip: add your parent\'s phone or e-mail with "✎ Change name" to send in one tap.',pEdit:'Parent contact'}:{
    who:'Kim oynuyor?',whoHint:'Adını, soyadını ve sınıfını bir kez yaz. Tüm oyunlar hatırlar.',
    n:'Ad',s:'Soyad',c:'Sınıf / şube (örnek: 7-A)',save:'Kaydet',bad:'Lütfen ad, soyad ve sınıfı 7-A gibi yaz.',
    edit:'Adı değiştir',send:'📤 Öğretmenime gönder',sendT:'Raporunu öğretmenine gönder',
    sendIntro:'Bu mesajı öğretmenine WhatsApp, BiP ya da e-posta ile gönder. Öğretmenin bağlantıyı açınca ilerlemeni görür.',
    note:'Öğretmeninden mesaj',read:'Okudum',forOther:'Bu mesaj şu öğrenci için:',parent:'👨‍👩‍👧 Veliye gönder',parentT:'Veli mesajı',
    parentIntro:'Velinize gidecek Türkçe özet: ilerleme, öneriler ve ödül fikri. Göndermeden önce değiştirebilirsiniz.',
    classPanel:'Öğretmen ve veli',classHint:'Tüm oyunlardaki ilerlemeni öğretmenine, Türkçe özeti velinize gönder.',pf:'Babanın telefonu (isteğe bağlı)',pm:'Annenin telefonu (isteğe bağlı)',pe:'Velinin e-postası (isteğe bağlı)',pHint:'Yalnızca bu cihazda saklanır. Böylece WhatsApp ve e-posta doğrudan velinize açılır.',pBad:'Telefonu (örnek 0532 123 45 67) ve e-postayı kontrol edin.',pTo:'Doğrudan gidecek:',pNone:'İpucu: "✎ Adı değiştir" ile velinin telefonunu ya da e-postasını eklerseniz tek dokunuşla gönderilir.',pEdit:'Veli iletişimi'};

  /* ---- this game's summary, cached in shared storage so any game can send all four ---- */
  function summary(){
    const log=CL.get(PX+'-log',[]),lb=CL.get(PX+'-lbest',{}),now=Date.now(),wk=log.filter(e=>(e.d||0)>now-7*864e5);
    const dayset=new Set(wk.map(e=>new Date(e.d).toDateString()));
    const units=G.map(g=>{const e=log.filter(x=>x.th===g.id);return [g.id,CL.cut(g.tema||g.name,44),e.filter(x=>x.ok).length,e.length]});
    let weak=[];try{const S0=srsState();weak=LESSONS.filter(l=>S0[l.id]&&S0[l.id].weak).sort((a,b)=>S0[a.id].acc-S0[b.id].acc).slice(0,4).map(l=>CL.cut(`${l.no} ${l.t}`,64))}catch(e){}
    const mc={};log.filter(e=>!e.ok&&e.mis&&e.mis!=='other').forEach(e=>mc[e.mis]=(mc[e.mis]||0)+1);
    const mis=Object.entries(mc).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,c])=>{const m=M[k]||{};return [CL.cut(m.m||k,40),c,CL.cut(m.s||'',170)]});
    let streak=0;try{const d=dailyInfo();streak=d.alive?d.streak:0}catch(e){}
    const goal=CL.get(PX+'-goal',{target:500,reward:EN?'Family reward':'Aile ödülü',base:0}),got=Math.max(0,CL.get(PX+'-earned',0)-(goal.base||0));
    const sm={t:now,n:log.length,ok:log.filter(e=>e.ok).length,less:LESSONS.length,done:LESSONS.filter(l=>lb[l.id]>=7).length,
      last:log.length?log[log.length-1].d||0:0,streak,wk:{n:wk.length,ok:wk.filter(e=>e.ok).length,days:dayset.size},units,weak,mis,goal:{target:goal.target,reward:goal.reward,got}};
    CL.set('g7-sum-'+PX,sm);return sm}
  function allSums(){summary();const o={};for(const k in CL.GAMES){const s=CL.get('g7-sum-'+k,null);if(s&&s.n)o[k]=s}if(!Object.keys(o).length)o[PX]=CL.get('g7-sum-'+PX,null);return o}

  /* ---- name, surname, class: asked once ---- */
  function askName(force){const st=CL.student();if(st&&!force)return;if(document.querySelector('.cl-who'))return;
    const ov=document.createElement('div');ov.className='ov cl-ov cl-who';ov.innerHTML=`<div class="pnl cl-pnl" role="dialog" aria-modal="true" aria-label="${T.who}">
      <h2 style="margin-top:0">👋 ${T.who}</h2><p class="hint">${T.whoHint}</p>
      <label class="field">${T.n}<input id="cl-n" autocomplete="given-name" value="${CL.h(st?st.n:'')}"></label>
      <label class="field">${T.s}<input id="cl-s" autocomplete="family-name" value="${CL.h(st?st.s:'')}"></label>
      <label class="field">${T.c}<input id="cl-c" placeholder="7-A" value="${CL.h(st?st.c:'')}" autocapitalize="characters"></label>
      <hr style="border:0;border-top:1px solid var(--line);margin:12px 0 4px"><p class="hint">${T.pHint}</p>
      <label class="field">${T.pf}<input id="cl-pf" type="tel" inputmode="tel" autocomplete="off" placeholder="05xx xxx xx xx" value="${CL.h(CL.parent().father)}"></label>
      <label class="field">${T.pm}<input id="cl-pm" type="tel" inputmode="tel" autocomplete="off" placeholder="05xx xxx xx xx" value="${CL.h(CL.parent().mother)}"></label>
      <label class="field">${T.pe}<input id="cl-pe" type="email" inputmode="email" autocomplete="off" value="${CL.h(CL.parent().email)}"></label>
      <p class="hint cl-err" hidden>${T.bad}</p><p class="hint cl-perr" hidden>${T.pBad}</p><div class="row"><button class="btn gold" id="cl-ok" type="button">${T.save}</button>${st?`<button class="btn" id="cl-x" type="button">✕</button>`:''}</div></div>`;
    document.body.appendChild(ov);const $=id=>ov.querySelector('#'+id);setTimeout(()=>$('cl-n').focus(),50);
    const ok=()=>{const n=CL.cap($('cl-n').value),s=CL.cap($('cl-s').value),c=CL.normClass($('cl-c').value);
      if(n.length<2||s.length<2||!c){ov.querySelector('.cl-err').hidden=false;return}
      const pf=$('cl-pf').value.trim(),pm=$('cl-pm').value.trim(),pe=$('cl-pe').value.trim();if(!CL.okPhone(pf)||!CL.okPhone(pm)||!CL.okMail(pe)){ov.querySelector('.cl-perr').hidden=false;return}
      CL.set('g7-parent',{father:pf,mother:pm,email:pe});CL.set('g7-student',{n,s,c,t:Date.now()});ov.remove();if(!location.hash||location.hash==='#')hub();else decorateHome()};
    $('cl-ok').onclick=ok;ov.querySelectorAll('input').forEach(i=>i.onkeydown=e=>{if(e.key==='Enter')ok()});if($('cl-x'))$('cl-x').onclick=()=>ov.remove()}

  /* ---- teacher notes (arrive as #not=… links) ---- */
  function notesCard(){const st=CL.student(),N=CL.get('g7-notes',[]).map((x,i)=>({x,i})).filter(o=>!o.x.read).slice(-3);if(!N.length)return '';
    return N.map(({x,i})=>{const mine=!st||!x.to||CL.key(x.to)===CL.key(st);return `<section class="pnl cl-note" data-i="${i}">
      <h2 style="margin:0 0 6px">💬 ${T.note}</h2>${mine?'':`<p class="hint">${T.forOther} ${CL.h(CL.full(x.to))} (${CL.h(x.to.c)})</p>`}
      <p style="white-space:pre-wrap;margin:6px 0 10px">${CL.h(x.m)}</p><div class="row"><span class="hint">${CL.date(x.t)}${x.g&&CL.GAMES[x.g]?' · '+CL.GAMES[x.g].name:''}</span><button class="btn sm cl-read" type="button">✔ ${T.read}</button></div></section>`}).join('')}
  function takeHash(){const h=location.hash||'';let m;
    if((m=h.match(/^#not=([A-Za-z0-9_-]+)/))){const o=CL.unpack(m[1]);if(o&&o.m){const N=CL.get('g7-notes',[]);if(!N.some(x=>x.t===o.t&&x.m===o.m)){N.push({...o,read:false});CL.set('g7-notes',N.slice(-30))}}
      history.replaceState(null,'',location.pathname+location.search);hub();return true}
    return false}

  /* ---- send buttons ---- */
  function sendTeacher(){const st=CL.student();if(!st){askName(true);return}
    const games=allSums(),code=CL.pack({v:1,st,t:Date.now(),g:games});
    const lines=[`📊 ${EN?'Student report':'Öğrenci raporu'}: ${CL.full(st)} (${st.c}) · ${CL.date(Date.now())}`];
    for(const k in games){const g=games[k];lines.push(`• ${CL.GAMES[k].name}: ${g.done}/${g.less} ${EN?'lessons':'ders'} · %${CL.pct(g.ok,g.n)} ${EN?'correct':'doğru'} · ${EN?'last 7 days':'son 7 gün'}: ${g.wk.n} ${EN?'answers':'cevap'}`)}
    lines.push('',EN?'Teacher panel link:':'Öğretmen paneli bağlantısı:',CL.PANEL+'#r='+code);
    CL.share({en:EN,title:T.sendT,intro:T.sendIntro,text:lines.join('\n'),subject:`${EN?'Report':'Rapor'} – ${CL.full(st)} (${st.c})`,rows:8})}
  function sendParent(){const st=CL.student();if(!st){askName(true);return}const pc=CL.parent(),ph=CL.phones(pc,EN),to=[...ph.map(p=>p[0]+' '+p[1]),pc.email].filter(Boolean).join(' · ');
    CL.share({en:EN,title:T.parentT,intro:T.parentIntro+'<br>'+(to?`<b>${T.pTo}</b> ${CL.h(to)}`:T.pNone),phones:ph,email:pc.email,edit:true,rows:14,text:CL.parentMessage(st,allSums(),{date:CL.date(Date.now()),sign:'— Oyunlardan otomatik hazırlanan özet'}),subject:`${CL.full(st)} – haftalık özet`})}

  /* ---- home screen: the student's name, the send button, teacher notes ---- */
  function decorateHome(){const st=CL.student(),nm=document.querySelector('#app .profile .nm');if(!nm)return;
    if(st){nm.innerHTML=`${CL.h(CL.full(st))} <small class="cl-cls">${CL.h(st.c)}</small> <button class="cl-edit" type="button" title="${T.edit}" aria-label="${T.edit}">✎</button>`;nm.querySelector('.cl-edit').onclick=()=>askName(true)}
    const pb=document.querySelector('#app .profile .pbtns');if(pb&&!pb.querySelector('.cl-send')){const b=document.createElement('button');b.className='btn cl-send';b.type='button';b.textContent=T.send;b.onclick=sendTeacher;pb.insertBefore(b,pb.children[2]||null)}
    const prof=document.querySelector('#app .profile');document.querySelectorAll('#app .cl-note').forEach(x=>x.remove());
    const nc=notesCard();if(prof&&nc){prof.insertAdjacentHTML('afterend',nc);document.querySelectorAll('#app .cl-note .cl-read').forEach(b=>b.onclick=()=>{const i=+b.closest('.cl-note').dataset.i,N=CL.get('g7-notes',[]);if(N[i])N[i].read=true;CL.set('g7-notes',N);b.closest('.cl-note').remove()})}}
  function decorateReport(){const pg=document.querySelector('#app .page');if(!pg||pg.querySelector('.cl-rep'))return;const h1=pg.querySelector('h1');if(!h1)return;
    const st=CL.student();h1.insertAdjacentHTML('afterend',`<section class="pnl cl-rep"><h2>${T.classPanel}${st?` · ${CL.h(CL.full(st))} (${CL.h(st.c)})`:''}</h2><p class="hint">${T.classHint}</p>
      <div class="row"><button class="btn gold cl-rs" type="button">${T.send}</button><button class="btn cl-rp" type="button">${T.parent}</button><button class="btn cl-re" type="button">✎ ${T.edit} · ${T.pEdit}</button></div></section>`);
    pg.querySelector('.cl-rs').onclick=sendTeacher;pg.querySelector('.cl-rp').onclick=sendParent;pg.querySelector('.cl-re').onclick=()=>askName(true)}

  /* small styles for the windows and the name line */
  const css=document.createElement('style');css.textContent=`.cl-ov{cursor:auto}.cl-pnl{max-width:640px;width:100%;max-height:88vh;overflow:auto;text-align:left;cursor:auto}
    .cl-pnl .field{margin:8px 0}.cl-pnl .field input{width:100%}.cl-ta{width:100%;box-sizing:border-box;background:var(--paper);border:2px solid var(--line);border-radius:10px;padding:10px;color:var(--ink);font:500 .95rem/1.45 var(--f-body,system-ui);resize:vertical;margin:8px 0}
    .cl-btns{flex-wrap:wrap;gap:8px}.cl-cls{font-size:.7em;opacity:.8;margin-left:4px}.cl-edit{background:none;border:0;color:var(--ink-soft);cursor:pointer;font-size:.8em;padding:2px 6px}
    .cl-note{border-color:var(--gold)!important;box-shadow:0 0 0 2px color-mix(in srgb,var(--gold) 40%,transparent)}`;document.head.appendChild(css);

  /* wrap the game's own home and report pages (they are global functions) */
  const _hub=hub;hub=function(){const r=_hub.apply(this,arguments);try{summary();decorateHome()}catch(e){}return r};
  const _rep=reportPage;reportPage=function(){const r=_rep.apply(this,arguments);try{summary();decorateReport()}catch(e){}return r};
  window.addEventListener('hashchange',()=>{takeHash()});
  const FASTMODE=/[?&]fast=1/.test(location.search);
  if(FASTMODE&&!CL.student())CL.set('g7-student',{n:'Test',s:'Öğrenci',c:'7-A',t:Date.now()});
  if(!takeHash()){if(!location.hash||location.hash==='#')hub();else if(location.hash==='#rapor')reportPage()}
  if(!CL.student())askName(false);
  window.CL_GAME={summary,allSums,sendTeacher,sendParent,askName};
})()}
