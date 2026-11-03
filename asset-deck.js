// AssetManagerDeck — nav, presenter notes (N), word wall, and mockups cloned live from CampaignAssets Orange.html.
(function(){
const W=1920,H=1080,stage=document.getElementById('stage'),pad2=n=>String(n).padStart(2,'0');
const SRC='CampaignAssets Orange.html';
// Gallery slides: rows of asset labels (prefix match on the item label in CampaignAssets Orange).
const G={
mall:{rows:[[{l:'10i · Escalator',i:0,cap:'Escalator 1'},{l:'10i · Escalator',i:1,cap:'Escalator 2'},{l:'10i · Escalator',i:2,cap:'Escalator 3'},{l:'10h · Permanent',cap:'Conditions'}]]},
work:{rows:[['6a · New certification','6b · The leave letter','6c · The announcement',{l:'14d · Durdle share card',cap:'Durdle card'}],[{l:'8a · Medium rectangle',beat:3,cap:'8a · Banner'},{l:'8d · Billboard banner',beat:3,cap:'8d · Ekselator banner'},{l:'14g · Meeting background 1',cap:'Meeting background'},{l:'14g · Lock screen 1',cap:'Lock screen'}]]}
};
const slides=[...stage.querySelectorAll('.slide')],N=slides.length;
const HDR='<header class="hdr"><span class="brand">Learn to speak <span class="sel on">Durban.</span></span><span class="hdr-by"><img src="assets/logos/gateway-logo.png" alt="Gateway"></span><span class="hdr-r"><span class="chipx"><b>LTSD-2026</b>Parents’ evening</span></span></header>';
slides.forEach((s,i)=>{
  if(!s.hasAttribute('data-bare'))s.insertAdjacentHTML('afterbegin',HDR);
  s.querySelectorAll('[data-n]').forEach(p=>p.textContent=pad2(i+1));
  s.dataset.screenLabel=pad2(i+1)+' '+(s.dataset.screenLabel||'');
});
document.querySelectorAll('.sel.on').forEach(s=>{if(!s.querySelector(':scope>.h'))s.insertAdjacentHTML('beforeend','<i class="h l"></i><i class="h r"></i>');});
slides.forEach(s=>{[...s.querySelectorAll('.sel.on,.mark')].filter(x=>!x.closest('.hdr,.wall')).forEach((x,k)=>x.style.setProperty('--s',k));[...s.querySelectorAll(':scope>.body>*,:scope>.st>*')].forEach((c,k)=>c.style.setProperty('--a',k));[...s.children].filter(c=>!c.classList.contains('hdr')&&!c.classList.contains('body')&&!c.classList.contains('st')).forEach((c,k)=>c.style.setProperty('--a',k));
  s.querySelectorAll('.cards,.qs,.pts,.mpts,.flow,.gal-main,.stk').forEach(g=>{});
  [...s.querySelectorAll('.cards>.card,.qs>.q,.pts>.pt,.mpts>li,.flow>*,.blk,.lay,.fi,.site')].filter(el=>!el.parentElement.closest('.fi')).forEach((el,k)=>{el.classList.add('am');el.style.setProperty('--i',k);});});
const RW=280,railOn=()=>document.body.classList.contains('rail-on');
const fitStage=()=>{const rw=railOn()?RW:0,aw=innerWidth-rw,s=Math.min(aw/W,innerHeight/H)*(rw?.96:1);stage.style.left=(rw+aw/2)+'px';stage.style.transform='translate(-50%,-50%) scale('+s+')';};
addEventListener('resize',fitStage);fitStage();

const rail=document.getElementById('rail'),tR=document.getElementById('tRail'),tN=document.getElementById('tNotes'),tF=document.getElementById('tFull'),RKEY='ltsd-assetdeck-rail';
rail.innerHTML=slides.map((s,i)=>'<button type="button" data-i="'+i+'"><b>'+pad2(i+1)+'</b><span>'+s.dataset.screenLabel.replace(/^\d+\s*/,'')+'</span></button>').join('');
rail.addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(+b.dataset.i);});
function setRail(on){document.body.classList.toggle('rail-on',on);tR.setAttribute('aria-pressed',on);fitStage();try{localStorage.setItem(RKEY,on?'1':'0');}catch(e){}}
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function toggleFS(){if(isFS())(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const el=document.documentElement;(el.requestFullscreen||el.webkitRequestFullscreen).call(el);}}
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{const f=isFS();tF.setAttribute('aria-pressed',f);tF.textContent=f?'Exit fullscreen':'Fullscreen';if(f)setRail(false);fitStage();}));
tR.onclick=()=>setRail(!railOn());tN.onclick=()=>setNotes(!stage.classList.contains('notes-on'));tF.onclick=toggleFS;
let idleT;const wake=()=>{document.body.classList.remove('idle');clearTimeout(idleT);idleT=setTimeout(()=>document.body.classList.add('idle'),2500);};addEventListener('mousemove',wake);wake();
const ctr=document.getElementById('ctr'),notes=document.getElementById('notes'),KEY='ltsd-assetdeck-slide',NKEY='ltsd-assetdeck-notes';
let cur=0;
function setNotes(on){stage.classList.toggle('notes-on',on);tN.setAttribute('aria-pressed',on);try{localStorage.setItem(NKEY,on?'1':'0');}catch(e){}}
try{if(localStorage.getItem(NKEY)==='1')setNotes(true);}catch(e){}
try{if(localStorage.getItem(RKEY)!=='0'&&innerWidth>1100)setRail(true);}catch(e){}
function go(i){cur=Math.max(0,Math.min(N-1,i));slides.forEach((s,k)=>s.toggleAttribute('data-on',k===cur));
  ctr.innerHTML='<b>'+(cur+1)+'</b> / '+N;
  rail.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('on',k===cur));const ab=rail.children[cur];if(ab&&railOn()){const t=ab.offsetTop-rail.clientHeight/2+ab.offsetHeight/2;rail.scrollTo({top:t,behavior:'smooth'});}
  notes.querySelector('p').textContent=slides[cur].dataset.note||'';
  slides.forEach((s,k)=>s.querySelectorAll('iframe[data-lazy]').forEach(f=>{const near=k>=cur-1&&k<=cur+1;if(near&&!f.getAttribute('src'))f.src=f.dataset.lazy;else if(!near&&f.getAttribute('src')){f.src='about:blank';f.removeAttribute('src');}}));
  try{localStorage.setItem(KEY,cur);}catch(e){}history.replaceState(null,'','#'+(cur+1));ensure(cur);setTimeout(()=>{ensure(cur+1);ensure(cur-1);},60);}
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;const k=e.key;
  if(k==='ArrowRight'||k==='PageDown'||k===' '){e.preventDefault();go(cur+1);}else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();go(cur-1);}
  else if(k==='Home')go(0);else if(k==='End')go(N-1);else if(e.metaKey||e.ctrlKey||e.altKey)return;else if(k==='n'||k==='N')setNotes(!stage.classList.contains('notes-on'));else if(k==='s'||k==='S')setRail(!railOn());else if(k==='f'||k==='F')toggleFS();});
stage.classList.add('ready');
let start=parseInt(location.hash.slice(1),10)-1;if(isNaN(start)){try{start=+localStorage.getItem(KEY)||0;}catch(e){start=0;}}

// word wall
const wall=document.getElementById('wall'),L=window.LSD_LESSONS||[];
if(wall){
  wall.innerHTML=L.map((l,i)=>'<span class="ww" data-i="'+i+'"><span class="sel">'+l.w+'</span></span>').join(' ');
  const pick=i=>wall.querySelectorAll('.ww').forEach(w=>{const on=+w.dataset.i===i,s=w.firstChild;w.classList.toggle('on',on);s.classList.toggle('on',on);s.querySelectorAll('.h,.pop').forEach(x=>x.remove());if(on)s.insertAdjacentHTML('beforeend','<i class="h l"></i><i class="h r"></i>');});
  wall.addEventListener('mouseover',e=>{const w=e.target.closest('.ww');if(w)pick(+w.dataset.i);});
  wall._fit=()=>{let s=84;wall.style.fontSize=s+'px';while(wall.scrollHeight>wall.clientHeight+2&&s>28){s-=2;wall.style.fontSize=s+'px';}pick(0);};
}

// campaign mockups
const ifr=document.createElement('iframe');ifr.src=SRC;ifr.tabIndex=-1;ifr.setAttribute('aria-hidden','true');
ifr.style.cssText='position:fixed;left:-40000px;top:0;width:1480px;height:1000px;border:0;opacity:0;pointer-events:none';document.body.appendChild(ifr);
const copyPair=([s,d])=>{try{if(d.width!==s.width)d.width=s.width;if(d.height!==s.height)d.height=s.height;const c=d.getContext('2d');c.clearRect(0,0,d.width,d.height);c.drawImage(s,0,0);}catch(e){}};
const pairs=[],copyCanvases=()=>pairs.forEach(copyPair);
const EXTRA='.bt{animation:none!important;opacity:0!important}.beat1 .bt.b1,.beat2 .bt.b2,.beat3 .bt.b3{opacity:1!important}.set .pl>.mono{font-size:20px!important}.set .arw{font-size:34px!important}';
let sheet,d,items,waveDefs='';
const find=lab=>items.find(it=>{const b=it.querySelector(':scope>.lbl b');return b&&b.textContent.trim().startsWith(lab);});
const dims=fr=>{const a=fr.querySelector('.asset'),c=fr.querySelector('canvas');return a?[+a.dataset.w,+a.dataset.h]:[c.width,c.height];};
function shadow(host){const r=host.shadowRoot||host.attachShadow({mode:'open'});r.adoptedStyleSheets=[sheet];r.innerHTML=waveDefs;return r;}
function iso(n){n.querySelectorAll('.sel').forEach(s=>{if(s.parentElement)s.parentElement.style.isolation='isolate';});}
function track(src,node){const sc=src.querySelectorAll('canvas'),dc=node.querySelectorAll('canvas');sc.forEach((c,k)=>{const p=[c,dc[k]];pairs.push(p);copyPair(p);});}
function mountFrame(host,src,HW,HH,beat){
  const node=document.importNode(src,true);iso(node);if(host.dataset.name)drawCard(node.querySelector('canvas'),host.dataset);else track(src,node);const root=shadow(host);
  const a=node.querySelector('.asset'),cv=node.querySelector('canvas'),[w,h]=dims(src),s=Math.min(HW/w,HH/h);
  node.style.aspectRatio='auto';node.style.width=w*s+'px';node.style.height=h*s+'px';
  if(a){a.style.width=w+'px';a.style.height=h+'px';a.style.transform='scale('+s+')';}else{cv.style.width='100%';cv.style.height='100%';}
  if(beat)node.classList.add('beat'+beat);
  root.appendChild(node);host.setAttribute('data-ok','');
}
let cardKit;
async function drawCard(cv,o){try{if(!cardKit)cardKit=(async()=>{const t=await (await fetch('ui_kits/microsite-v2/student-card-screen.txt')).text();const S=new Function(t.slice(0,t.indexOf('// Name field is Mode B'))+';return{drawCard2,TITLE_ALL};')();
  const logo=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src='assets/logos/gateway-logo-white.png';});
  await Promise.all(["800 120px Switzer","600 30px Switzer","500 24px 'IBM Plex Mono'","700 30px Switzer"].map(f=>document.fonts.load(f))).catch(()=>{});return{S,logo};})();
  const{S,logo}=await cardKit;const level=S.TITLE_ALL.find(x=>x.n===o.title)||S.TITLE_ALL[0];
  S.drawCard2(cv,{img:null,name:o.name,level,word:o.word||'Kiff',style:'Pixelate',cell:8,zoom:1,posX:.5,posY:.3,no:o.no||'LTSD-2026-00000',logo,origin:o.origin});}catch(e){console.error('AssetDeck card',e);}}
const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const GAP=24,RG=20,CAP=40;
function buildGallery(gal,g){
  const main=gal.querySelector('.gal-main'),MW=main.clientWidth,MH=main.clientHeight;
  const rows=g.rows.map(r=>r.map(x=>{const o=typeof x==='string'?{l:x}:x,it=find(o.l);if(!it){console.warn('AssetDeck: no asset',o.l);return null;}const fr=it.querySelectorAll('.frame')[o.i||0];if(!fr)return null;const[w,h]=dims(fr);return Object.assign({},o,{fr,a:w/h,cap:o.cap||it.querySelector(':scope>.lbl b').textContent.trim()});}).filter(Boolean));
  let hs=rows.map(r=>Math.min(MH,(MW-GAP*(r.length-1))/r.reduce((s,x)=>s+x.a,0)));
  const fixed=rows.length*CAP+(rows.length-1)*RG,sum=hs.reduce((a,b)=>a+b,0);
  if(sum+fixed>MH){const k=(MH-fixed)/sum;hs=hs.map(h=>h*k);}
  rows.forEach((r,k)=>{const row=document.createElement('div');row.className='gal-row';main.appendChild(row);
    r.forEach(x=>{const h=Math.floor(hs[k]),w=Math.floor(x.a*hs[k]),fig=document.createElement('div');fig.className='fi';fig.style.width=w+'px';
      const host=document.createElement('div');host.className='mnt';host.style.cssText='width:'+w+'px;height:'+h+'px';
      fig.classList.add('am');fig.style.setProperty('--i',row.children.length+k*4);fig.appendChild(host);fig.insertAdjacentHTML('beforeend','<span class="cap">'+esc(x.cap)+'</span>');row.appendChild(fig);mountFrame(host,x.fr,w,h,x.beat);});});
}
const built=new Set();let fontsOK=false;
function buildSlide(s){
  const w=s.querySelector('#wall');if(w&&w._fit){if(!fontsOK)return false;w._fit();}
  if(!s.querySelector('.mnt[data-src],.gal[data-g],.stk'))return true;
  if(!d)return false;
  const stk=s.querySelector('.stk');if(stk){const g=d.getElementById('lsdStickers'),cs=g?[...g.querySelectorAll('canvas')]:[];if(cs.length<44){setTimeout(()=>ensure(slides.indexOf(s)),800);return false;}
    cs.forEach(c=>{const n=document.createElement('canvas');n.title=c.title;stk.appendChild(n);const p=[c,n];pairs.push(p);copyPair(p);});}
  [...s.querySelectorAll('.mnt[data-src]')].map(h=>[h,h.clientWidth,h.clientHeight]).forEach(([host,HW,HH])=>{const it=find(host.dataset.src);if(!it){console.warn('AssetDeck: no asset',host.dataset.src);return;}
    const src=it.querySelectorAll('.frame')[+host.dataset.i||0];if(src)mountFrame(host,src,HW,HH,host.dataset.beat);});
  s.querySelectorAll('.gal[data-g]').forEach(gal=>{try{buildGallery(gal,G[gal.dataset.g]);}catch(e){console.error('AssetDeck gallery',gal.dataset.g,e);}});
  return true;
}
function ensure(k){const s=slides[k];if(!s||built.has(k))return;const on=s.hasAttribute('data-on');if(!on)s.style.cssText='display:block;visibility:visible;opacity:0;z-index:-1;pointer-events:none';
  try{if(buildSlide(s))built.add(k);}finally{if(!on)s.style.cssText='';}}
window.__deckGo=go;
addEventListener('beforeprint',()=>{for(let k=0;k<N;k++)ensure(k);});
document.fonts.ready.then(()=>{fontsOK=true;ensure(cur);});
go(start);
ifr.onload=async()=>{const dd=ifr.contentDocument;try{await Promise.all([dd.fonts.ready,document.fonts.ready]);}catch(e){}setTimeout(()=>{
  sheet=new CSSStyleSheet();sheet.replaceSync([...dd.querySelectorAll('head style')].map(s=>s.textContent).join('\n').replace(/:root/g,':host')+EXTRA);
  for(let r=sheet.cssRules.length-1;r>=0;r--){const x=sheet.cssRules[r];if(x.selectorText&&x.selectorText.includes(':has('))sheet.deleteRule(r);}
  const wv=dd.getElementById('lsdWave');if(wv)waveDefs=wv.closest('svg').outerHTML;
  items=[...dd.querySelectorAll('.item')];d=dd;fontsOK=true;
  ensure(cur);ensure(cur+1);ensure(cur-1);
  const mc=new MessageChannel();let k=0;mc.port1.onmessage=()=>{const t=performance.now();while(k<N&&performance.now()-t<30)ensure(k++);if(k<N)mc.port2.postMessage(0);};setTimeout(()=>mc.port2.postMessage(0),400);
  [1500,3000,6000,10000].forEach(t=>setTimeout(copyCanvases,t));},500);};
})();
