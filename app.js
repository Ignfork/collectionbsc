/* 合集 · BNB 链 meme 指数 —— 站点脚本 */
{
// ====== 上线前在这里填写 ======
const CONFIG = {
  TICKER: '$合集',
  X_URL: 'https://x.com/CollectionBSC',        // 例如 https://x.com/你的账号
  CA: ''            // 合约地址，上线后填写；留空则显示"即将公布"
};

const INDEXES = [
  {code:'FOUR20', n:20, title:'four.meme 发射基准', desc:'追踪 20 个在 four.meme 发射并毕业的币。', universe:'four.meme 毕业币',
   rules:['在 four.meme 发射并完成内盘毕业','已在 PancakeSwap 建立流动性池','按 24 小时成交额排名，取前 20']},
  {code:'ALPHA20', n:20, title:'币安 Alpha 精选', desc:'追踪 20 个登上币安 Alpha 的 BNB 链代币。', universe:'币安 Alpha · BNB 链',
   rules:['已上线币安 Alpha 列表','BNB 链 BEP-20 合约，源码已验证','流动性与成交额均达到门槛']},
  {code:'BNB50', n:50, title:'BNB 链 meme 基准', desc:'追踪 BNB 链上 50 个 meme 币。', universe:'BNB 链 meme 币',
   rules:['BNB 链原生 meme 币','按市值与流动性综合排名，取前 50','合约无增发、无黑名单权限']},
  {code:'CN20', n:20, title:'华语 meme 风向标', desc:'追踪 20 个中文名 meme 币。', universe:'中文名 meme · BNB 链',
   rules:['代币名称或代码为中文','部署于 BNB 链并有真实流动性','持币地址数与社区活跃度达标']}
];
const BY = Object.fromEntries(INDEXES.map(i=>[i.code,i]));
const W = n => (100/n).toFixed(2)+'%';

const ICON = {
  FOUR20:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="9" width="54" height="51" rx="14" fill="#0B0E11"/><rect x="5" y="4" width="54" height="51" rx="14" fill="#F0B90B" stroke="#0B0E11" stroke-width="3"/><path d="M36 14 22 36h20" fill="none" stroke="#0B0E11" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="M36 14v30" stroke="#0B0E11" stroke-width="6" stroke-linecap="round"/><path d="M48 11l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff" stroke="#0B0E11" stroke-width="1.5"/></svg>`,
  ALPHA20:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8 58 34 32 60 6 34Z" fill="#C99400"/><path d="M32 4 58 30 32 56 6 30Z" fill="#0B0E11" stroke="#0B0E11" stroke-width="3" stroke-linejoin="round"/><path d="M32 12 50 30 32 48 14 30Z" fill="none" stroke="#FCD535" stroke-width="2"/><text x="32" y="38" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="24" fill="#FCD535">α</text></svg>`,
  BNB50:`<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#0B0E11" stroke-width="3" stroke-linejoin="round"><path d="M32 5 57 18 32 31 7 18Z" fill="#F0B90B"/><path d="M7 18 32 31v28L7 46Z" fill="#fff"/><path d="M57 18 32 31v28l25-13Z" fill="#0B0E11"/></g><path d="M32 12l7 6-7 6-7-6z" fill="#0B0E11"/><text x="19" y="46" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="800" font-size="12" fill="#0B0E11" transform="skewY(27) translate(0,-9)">50</text><text x="45" y="46" text-anchor="middle" font-family="Noto Sans SC,sans-serif" font-weight="900" font-size="12" fill="#FCD535" transform="skewY(-27) translate(0,23)">合</text></svg>`,
  CN20:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="9" width="52" height="51" rx="12" fill="#C99400"/><rect x="6" y="4" width="52" height="51" rx="12" fill="#0B0E11" stroke="#0B0E11" stroke-width="3"/><rect x="12" y="10" width="40" height="39" rx="7" fill="none" stroke="#F0B90B" stroke-width="2" stroke-dasharray="4 3"/><text x="32" y="41" text-anchor="middle" font-family="ZCOOL QingKe HuangYou,Noto Sans SC,sans-serif" font-size="30" fill="#FCD535">中</text></svg>`
};

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const fmt = (x,d=4)=>isFinite(x)?(+x).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:d}):'—';

// ---------- toast ----------
const toastEl = document.createElement('div'); toastEl.className='toast'; toastEl.setAttribute('role','status'); document.body.appendChild(toastEl);
let tt; const toast = m=>{toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),2600)};

// ---------- header ----------
$$('.more>button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();b.parentElement.classList.toggle('open');b.setAttribute('aria-expanded',b.parentElement.classList.contains('open'))}));
document.addEventListener('click',()=>$$('.more.open').forEach(m=>m.classList.remove('open')));
const burger=$('.burger'); burger&&burger.addEventListener('click',()=>$('.nav').classList.toggle('open'));
$$('[data-icon]').forEach(el=>el.innerHTML=ICON[el.dataset.icon]||'');
$$('[data-ticker]').forEach(el=>el.textContent=CONFIG.TICKER);
$$('[data-x]').forEach(a=>{ if(CONFIG.X_URL){a.href=CONFIG.X_URL;a.target='_blank';a.rel='noopener'} else a.addEventListener('click',e=>{e.preventDefault();toast('官方 X 账号即将公布')}) });

// ---------- modals ----------
const openModal = id=>{const m=$('#'+id); if(!m) return; m.classList.add('open'); const i=$('input',m); i&&setTimeout(()=>i.focus(),30)};
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))m.classList.remove('open')}));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') $$('.modal.open').forEach(m=>m.classList.remove('open'));
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openModal('search')}
});
$$('[data-open]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openModal(b.dataset.open)}));

// search palette
const PAGES = [
  ['首页','index.html','页面'],['市场目录','markets.html','页面'],['交易终端','trade.html#BNB50','页面'],['金库','treasury.html','页面'],
  ['持仓','trade.html#portfolio','页面'],[CONFIG.TICKER+' 代币','token.html','代币'],['方法论','docs.html#methodology','文档'],['上币规则','docs.html#listings','文档'],
  ['费用','docs.html#fees','文档'],['风险','docs.html#risk','文档'],['安全','docs.html#security','文档'],['状态','docs.html#status','文档'],
  ...INDEXES.map(i=>[i.code+' · '+i.title,'trade.html#'+i.code,'指数'])
];
const sIn=$('#search input'), sList=$('#search ul');
const renderSearch=q=>{ q=(q||'').trim().toLowerCase();
  const r=PAGES.filter(p=>!q||p[0].toLowerCase().includes(q)||p[2].includes(q));
  sList.innerHTML=r.map((p,i)=>`<li><a href="${p[1]}" class="${i?'':'sel'}">${p[0]}<small>${p[2]}</small></a></li>`).join('')||'<li class="muted" style="padding:12px">没有找到结果</li>';
};
if(sIn){ renderSearch(''); sIn.addEventListener('input',()=>renderSearch(sIn.value));
  sIn.addEventListener('keydown',e=>{ if(e.key==='Enter'){const a=$('a.sel',sList); a&&(location.href=a.getAttribute('href'))} });
  sList.addEventListener('click',()=>$('#search').classList.remove('open')); }

// wallet
const BSC={chainId:'0x38',chainName:'BNB Smart Chain',nativeCurrency:{name:'BNB',symbol:'BNB',decimals:18},rpcUrls:['https://bsc-dataseed.bnbchain.org'],blockExplorerUrls:['https://bscscan.com']};
async function connect(){
  const eth=window.ethereum;
  if(!eth){toast('未检测到钱包，请安装 MetaMask、币安钱包或 Trust Wallet');return}
  try{
    const [acc]=await eth.request({method:'eth_requestAccounts'});
    try{await eth.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x38'}]})}
    catch(err){ if(err&&err.code===4902) await eth.request({method:'wallet_addEthereumChain',params:[BSC]}) }
    const short=acc.slice(0,6)+'…'+acc.slice(-4);
    $$('[data-open=wallet]').forEach(b=>b.textContent=short);
    $('#wallet').classList.remove('open'); toast('已连接 BNB 智能链 · '+short);
  }catch(e){toast('连接已取消')}
}
$$('#wallet .wallets button').forEach(b=>b.addEventListener('click',connect));

// ---------- reveal ----------
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));

// ---------- ribbons ----------
$$('svg.ribbon').forEach(s=>{
  const d=s.dataset.path, off=+(s.dataset.off||44), w=+(s.dataset.w||46);
  const cols=(s.dataset.cols||'#F0B90B,#FFFFFF,#0B0E11').split(',');
  s.innerHTML=`<defs><filter id="rs${off}" x="-5%" y="-20%" width="110%" height="150%"><feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#0B0E11" flood-opacity=".22"/></filter></defs>
  <g filter="url(#rs${off})" fill="none"><path d="${d}" stroke="#0B0E11" stroke-width="${w*3+10}" transform="translate(0,${off})"/>
  ${cols.map((c,i)=>`<path d="${d}" stroke="${c}" stroke-width="${w}" transform="translate(0,${i*off})"/>`).join('')}</g>`;
});

// ---------- hero cube ----------
const cubebox=$('.cubebox');
if(cubebox){
  const cube=$('.cube',cubebox); let rx=-22, ry=-34, vx=0, vy=.18, drag=null, idle=true, target=null;
  const size=()=>cube.style.setProperty('--s',cubebox.clientWidth+'px'); size(); new ResizeObserver(size).observe(cubebox);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  cubebox.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};idle=false;target=null;cubebox.setPointerCapture(e.pointerId)});
  cubebox.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;vy=dx*.35;vx=-dy*.35;ry+=vy;rx+=vx;drag={x:e.clientX,y:e.clientY}});
  const up=()=>{drag=null;setTimeout(()=>idle=true,1800)}; cubebox.addEventListener('pointerup',up); cubebox.addEventListener('pointercancel',up);
  const FACES={FOUR20:[-12,-90],ALPHA20:[-12,90],BNB50:[-14,-20],CN20:[-12,180]};
  $$('.inspect .chips button').forEach(b=>b.addEventListener('click',()=>{
    $$('.inspect .chips button').forEach(x=>x.classList.toggle('on',x===b));
    const code=b.dataset.code; $('#cubeTag').textContent='合集 / '+code; target=FACES[code]; idle=false; setTimeout(()=>{idle=true;target=null},3200);
  }));
  const loop=()=>{
    if(target){vx=0;vy=0; rx+=(target[0]-rx)*.08; const cur=((ry%360)+360)%360; let diff=target[1]-cur; if(diff>180)diff-=360; if(diff<-180)diff+=360; ry+=diff*.08}
    else if(!drag){ if(idle&&!reduce){vy+=(.18-vy)*.02; vx*=.94; rx+=( -20-rx)*.01} else {vy*=.95;vx*=.95} ry+=vy; rx+=vx }
    rx=Math.max(-70,Math.min(70,rx));
    cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`; requestAnimationFrame(loop);
  }; loop();
}

// ---------- markets carousel (home) ----------
const car=$('#carousel');
if(car){
  let cur=2;
  const show=i=>{ cur=(i+INDEXES.length)%INDEXES.length; const x=INDEXES[cur];
    $$('.tabs .tab').forEach((t,k)=>{t.classList.toggle('on',k===cur);t.setAttribute('aria-selected',k===cur)});
    $('.hero-ico',car).innerHTML=ICON[x.code];
    $('#cTitle').textContent=x.title; $('#cDesc').textContent=x.desc;
    $('#cN').textContent='0/'+x.n; $('#cBtn').href='trade.html#'+x.code; $('#cBtn span').textContent='查看 '+x.code;
    $('#cW').textContent=W(x.n);
    const ico=$('.hero-ico',car); ico.style.animation='none'; ico.offsetWidth; ico.style.animation='';
  };
  $('.tabs').innerHTML=INDEXES.map((x,k)=>`<button class="tab" role="tab" data-k="${k}">${ICON[x.code]}<span>${x.code}</span></button>`).join('');
  $$('.tabs .tab').forEach(t=>t.addEventListener('click',()=>show(+t.dataset.k)));
  let sx=null; car.addEventListener('pointerdown',e=>sx=e.clientX); car.addEventListener('pointerup',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>50)show(cur+(e.clientX<sx?1:-1));sx=null});
  car.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)});
  show(2);
}

// ---------- basket anatomy ----------
const ana=$('#anatomy');
if(ana){
  const sel=$('select',ana), slots=$('.slots',ana), out=$('.inspectout',ana), svg=$('#donut'), cW=$('#donutW');
  const draw=(code,act)=>{ const x=BY[code], n=x.n, R=150, r=96, cx=180, cy=180, gap=n>30?.012:.02; let p='';
    for(let i=0;i<n;i++){ const a0=i/n*Math.PI*2-Math.PI/2+gap, a1=(i+1)/n*Math.PI*2-Math.PI/2-gap;
      const P=(rad,a)=>[cx+rad*Math.cos(a),cy+rad*Math.sin(a)].map(v=>v.toFixed(2)).join(',');
      const on=i===act, R2=on?R+14:R;
      p+=`<path d="M${P(R2,a0)} A${R2},${R2} 0 0 1 ${P(R2,a1)} L${P(r,a1)} A${r},${r} 0 0 0 ${P(r,a0)}Z" fill="${on?'url(#dg)':['#0B0E11','#FFC20E','#2B3139','#FFE066'][i%4]}" stroke="#0B0E11" stroke-width="1.5" data-i="${i}" style="cursor:pointer"/>`; }
    svg.innerHTML=`<defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1A8"/><stop offset="1" stop-color="#F0A500"/></linearGradient></defs><circle cx="180" cy="188" r="170" fill="#0B0E11" opacity=".14"/><circle cx="180" cy="180" r="170" fill="none" stroke="#0B0E11" stroke-width="3" stroke-dasharray="2 8"/><circle cx="180" cy="180" r="92" fill="#FFFDF4" stroke="#0B0E11" stroke-width="3"/>`+p;
    $$('path',svg).forEach(el=>el.addEventListener('click',()=>pick(+el.dataset.i)));
  };
  const pick=i=>{ const x=BY[sel.value];
    $$('.slot',slots).forEach((s,k)=>s.classList.toggle('on',k===i)); draw(sel.value,i);
    cW.textContent=W(x.n);
    out.innerHTML=`<b>槽位 ${String(i+1).padStart(2,'0')} · ${x.code}</b><br>目标权重 <b class="mono">${W(x.n)}</b> · 状态 <span class="pill">待验证</span><br><span class="muted">入选标准：${x.rules.join('；')}。成分将在开盘前公布并经链上验证。</span>`;
  };
  const build=()=>{ const x=BY[sel.value];
    slots.innerHTML=Array.from({length:x.n},(_,i)=>`<button class="slot" data-i="${i}"><i></i>${String(i+1).padStart(2,'0')}</button>`).join('');
    $$('.slot',slots).forEach(s=>s.addEventListener('click',()=>pick(+s.dataset.i)));
    $('#anaLink').href='trade.html#'+x.code; draw(x.code,-1); cW.textContent=W(x.n);
    out.innerHTML='<span class="muted">选择一个槽位，查看它在篮子中的权重。</span>';
  };
  sel.innerHTML=INDEXES.map(x=>`<option ${x.code==='BNB50'?'selected':''}>${x.code}</option>`).join('');
  sel.addEventListener('change',build); build();
}

// ---------- calculator / ticket ----------
$$('[data-calc]').forEach(root=>{
  let side='long', lev=1;
  const col=$('[name=col]',root), mv=$('[name=move]',root);
  const set=(k,v)=>{const e=$(`[data-o=${k}]`,root); if(e) e.innerHTML=v};
  const calc=()=>{
    const c=Math.min(Math.max(parseFloat(col.value)||0,0),10), notional=c*lev, fee=notional*.002;
    set('notional', c?fmt(notional)+' BNB':'—'); set('max', c?'± '+fmt(c)+' BNB':'—'); set('fee', c?fmt(fee,5)+' BNB':'0.20% 名义价值');
    if(mv){ const m=parseFloat(mv.value)||0; $('[data-o=movev]',root).textContent=(m>0?'+':'')+m+'%';
      let pnl=notional*m/100*(side==='long'?1:-1); pnl=Math.max(-c,Math.min(c,pnl)); const net=pnl-fee;
      const el=$('[data-o=pnl]',root); el.textContent=c?((net>=0?'+':'')+fmt(net)+' BNB'):'—'; el.className='pnl '+(net>=0?'up':'dn');
      set('roi', c?((net/c*100>=0?'+':'')+(net/c*100).toFixed(2)+'%'):'—'); }
    const warn=$('[data-o=warn]',root); if(warn){ const v=parseFloat(col.value); warn.style.display=(col.value&&(v<.01||v>10))?'block':'none' }
  };
  $$('.seg button',root).forEach(b=>b.addEventListener('click',()=>{side=b.dataset.side;$$('.seg button',root).forEach(x=>x.classList.toggle('on',x===b));calc()}));
  $$('.levs button',root).forEach(b=>b.addEventListener('click',()=>{lev=+b.dataset.l;$$('.levs button',root).forEach(x=>x.classList.toggle('on',x===b));calc()}));
  col.addEventListener('input',calc); mv&&mv.addEventListener('input',calc);
  const place=$('[data-place]',root); place&&place.addEventListener('click',()=>toast('指数尚未开盘，等待首个官方报价后开放下单'));
  calc();
});

// ---------- countdown to next rebalance (00:00 UTC) ----------
const cd=$$('[data-countdown]');
if(cd.length){ const tick=()=>{ const n=new Date(), t=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()+1)-n.getTime();
  const h=Math.floor(t/36e5), m=Math.floor(t%36e5/6e4), s=Math.floor(t%6e4/1e3);
  cd.forEach(e=>e.textContent=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':')) }; tick(); setInterval(tick,1000); }

// ---------- markets page ----------
const mrows=$('#mrows');
if(mrows){
  mrows.innerHTML=INDEXES.map(x=>`<a class="mrow" href="trade.html#${x.code}">${ICON[x.code]}<div><h3>${x.code}</h3><p>${x.desc}</p></div>
  <div class="r"><span class="pill">0/${x.n} 待验证</span><br><span>基准点位 · 1,000.00 · 待开盘</span></div><span class="arrow">↗</span></a>`).join('');
  $('#mtable tbody').innerHTML=INDEXES.map(x=>`<tr><td><b class="mono">${x.code}</b></td><td>${x.universe}</td><td class="n">${x.n}</td><td class="n">${W(x.n)}</td><td>每 24 小时</td><td class="n">1–5×</td><td><span class="pill">待开盘</span></td></tr>`).join('');
}

// ---------- trade page ----------
const tr=$('#trade');
if(tr){
  const render=()=>{
    let code=(location.hash||'').slice(1); if(code==='portfolio'){ $('#portfolio').scrollIntoView(); code='BNB50' }
    if(!BY[code]) code='BNB50'; const x=BY[code];
    $('#idxtabs').innerHTML=INDEXES.map(i=>`<a href="#${i.code}" class="${i.code===code?'on':''}">${i.code}</a>`).join('');
    $('#tIcon').innerHTML=ICON[code]; $('#tName').textContent=code; $('#tDesc').textContent=x.desc;
    $('#tCons').textContent='0/'+x.n+' 成分已验证';
    $('#ctable tbody').innerHTML=Array.from({length:x.n},(_,i)=>`<tr><td class="n">${String(i+1).padStart(2,'0')}</td><td class="muted">待公布</td><td class="n">${W(x.n)}</td><td><span class="pill">待验证</span></td></tr>`).join('');
    $('#cRules').innerHTML=x.rules.map(r=>`<li>${r}</li>`).join('');
    document.title=code+' 交易终端 | 合集';
  };
  addEventListener('hashchange',render); render();
  $$('.tfs button').forEach(b=>b.addEventListener('click',()=>{$$('.tfs button').forEach(x=>x.classList.toggle('on',x===b))}));
}

// ---------- docs status ----------
const st=$('#statusIdx');
if(st) st.innerHTML=INDEXES.map(x=>`<div class="statusrow"><span><b class="mono">${x.code}</b> <span class="muted">· ${x.universe}</span></span><span class="pill">待开盘</span></div>`).join('');

// ---------- token page ----------
const ca=$('#ca');
if(ca){ ca.value=CONFIG.CA||'即将公布 · 请以官方 X 发布为准';
  $('#copyCA').addEventListener('click',async()=>{ if(!CONFIG.CA){toast('合约地址尚未公布');return} try{await navigator.clipboard.writeText(CONFIG.CA);toast('合约地址已复制')}catch(e){toast('复制失败，请手动选择')} }); }

$$('[data-soon]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();toast(b.dataset.soon)}));

// ================= FX =================
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
// scroll progress
const prog=$('.progress'); if(prog){ const up=()=>{const h=document.documentElement; prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+'%'}; addEventListener('scroll',up,{passive:true}); up(); }
// card spotlight + tilt
$$('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px')}));
if(!RM && matchMedia('(hover:hover)').matches){
  $$('[data-tilt]').forEach(c=>{
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5; c.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-3px)`});
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });
  // hero parallax
  const hero=$('.hero');
  if(hero){ const coins=$$('.hero .coin'), h1=$('.hero h1');
    hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      coins.forEach((c,i)=>c.style.translate=`${x*(18+i*8)}px ${y*(18+i*8)}px`); h1.style.transform=`translate(${x*-10}px,${y*-6}px)`});
  }
}
// gold sparkle particles
$$('canvas.sparks').forEach(cv=>{
  const ctx=cv.getContext('2d'); let W=0,H=0,P=[]; const dpr=Math.min(devicePixelRatio||1,2);
  const size=()=>{W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    P=Array.from({length:Math.round(W*H/16000)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.6,v:Math.random()*.35+.08,t:Math.random()*6.28,s:Math.random()<.18}))};
  size(); const sro=new ResizeObserver(size); sro.observe(cv);
  const star=(x,y,r)=>{ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,R=i%2?r*.35:r*1.8;ctx.lineTo(x+Math.cos(a)*R,y+Math.sin(a)*R)}ctx.closePath();ctx.fill()};
  const draw=()=>{ctx.clearRect(0,0,W,H);
    for(const p of P){ p.t+=.03; if(!RM){p.y-=p.v; if(p.y<-10){p.y=H+10;p.x=Math.random()*W}}
      const a=.35+.45*Math.sin(p.t); ctx.fillStyle=`rgba(255,${180+Math.round(40*Math.sin(p.t))},20,${a.toFixed(2)})`;
      if(p.s) star(p.x,p.y,p.r*2.2); else {ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill()} }
    RM||requestAnimationFrame(draw)}; draw();
});

// ===== detail layer =====
const cg=$('.cglow'); if(cg&&matchMedia('(hover:hover)').matches) addEventListener('pointermove',e=>{cg.style.transform=`translate(${e.clientX}px,${e.clientY}px)`},{passive:true});
const tt2=$('.totop'); if(tt2){ addEventListener('scroll',()=>tt2.classList.toggle('show',scrollY>700),{passive:true}); tt2.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'})) }
const cio=new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return; cio.unobserve(e.target);
  const el=e.target, to=+el.dataset.count, dec=+(el.dataset.dec||0), suf=el.dataset.suf||'', t0=performance.now(), D=RM?0:1400;
  const step=t=>{const k=D?Math.min(1,(t-t0)/D):1, v=to*(1-Math.pow(1-k,3)); el.textContent=v.toFixed(dec)+suf; if(k<1) requestAnimationFrame(step)}; requestAnimationFrame(step);
}),{threshold:.5});
$$('[data-count]').forEach(el=>cio.observe(el));
}
