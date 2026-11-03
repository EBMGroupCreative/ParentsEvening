(function(){
const btn=document.getElementById('jpgx');if(!btn)return;
const load=s=>new Promise((r,j)=>{if(document.querySelector('script[src="'+s+'"]'))return r();const e=document.createElement('script');e.src=s;e.onload=r;e.onerror=j;document.head.appendChild(e)});
const slug=s=>s.replace(/[\/\\:*?"<>|]+/g,'-').replace(/\s+/g,' ').trim().slice(0,110);
let busy=false,url=null;const label=btn.textContent;
btn.onclick=async e=>{
  if(url)return;e.preventDefault();if(busy)return;busy=true;
  try{
    btn.textContent='Loading…';
    await load('https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js');
    await load('https://unpkg.com/jszip@3.10.1/dist/jszip.min.js');
    await document.fonts.ready;
    const H=window.htmlToImage,zip=new JSZip(),defs=document.querySelector('svg defs')?.closest('svg');
    const jobs=[];
    [...document.querySelectorAll('.frame')].filter(f=>f.offsetParent).forEach(fr=>{
      const sec=slug(fr.closest('section.grp')?.dataset.screenLabel||'Other'),b=fr.closest('.item')?.querySelector('.lbl b'),name=slug(b?b.textContent:'Untitled');
      if(fr.querySelector('.bt'))[1,2,3].forEach(n=>jobs.push({fr,sec,name:name+' · beat '+n,beat:n}));else jobs.push({fr,sec,name});
    });
    const cnt={},seen={};jobs.forEach(j=>{const k=j.sec+'/'+j.name;cnt[k]=(cnt[k]||0)+1});
    jobs.forEach(j=>{const k=j.sec+'/'+j.name;if(cnt[k]>1){seen[k]=(seen[k]||0)+1;j.name+=' · '+seen[k]}});
    const fontEmbedCSS=await H.getFontEmbedCSS(document.querySelector('.frame .asset'));
    const pb=document.body.getAttribute('data-beat');let done=0;
    for(const j of jobs){
      try{
        let u;const cv=j.fr.querySelector('canvas'),a=j.fr.querySelector('.asset');
        if(j.beat)document.body.setAttribute('data-beat',j.beat);
        if(cv&&!a){const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(cv,0,0);u=c.toDataURL('image/jpeg',.92);}
        else{const w=+a.dataset.w,h=+a.dataset.h;let d=null;if(defs&&a.querySelector('use')){d=defs.cloneNode(true);a.prepend(d);}
          u=await H.toJpeg(a,{width:w,height:h,pixelRatio:1,quality:.92,fontEmbedCSS,backgroundColor:getComputedStyle(a).backgroundColor,style:{transform:'none',left:'0',top:'0',margin:'0'}});if(d)d.remove();}
        zip.folder(j.sec).file(j.name+'.jpg',u.split(',')[1],{base64:true});
      }catch(err){console.warn('jpg export',j.name,err);}
      btn.textContent='Rendering '+(++done)+' / '+jobs.length;
    }
    if(pb===null)document.body.removeAttribute('data-beat');else document.body.setAttribute('data-beat',pb);
    btn.textContent='Zipping…';
    const blob=await zip.generateAsync({type:'blob'});
    url=URL.createObjectURL(blob);
    btn.href=url;btn.download='LTSD Campaign Assets Orange - JPGs.zip';
    btn.textContent='Download zip · '+Math.round(blob.size/1e6)+' MB';
    btn.click();
  }catch(err){console.error(err);btn.textContent=label;}
  busy=false;
};
})();
