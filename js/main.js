const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// S1 live — Novo Trabalho + spinner + Resumo + toast (v3 port)
(function(){
  const demo=document.getElementById('s1demo');
  if(!demo)return;
  const TOPIC='Impacto da inflação nas PMEs em Luanda';
  const INTRO='A inflação em Angola mudou a forma como as pequenas empresas de Luanda compram e fixam preços. Este trabalho analisa o repasse de custos e a renegociação com fornecedores.';
  const BULLETS=[
    'Retalhistas ajustam preços ~2× mais devagar que grandes superfícies (Lemos et al., 2024).',
    '68% renegociou com fornecedores após choque de custos (Santos et al., 2024).',
    'Margens curtas expandem 0.5 SD com 2+ fornecedores (Miguel & Singh, 2020).',
    'Choques de oferta superam gaps de procura no período (Jacob, 2015).',
    'Monitorização semanal reduz ruptura sem perder margem.'
  ];
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const typed=document.getElementById('s1typed'),cta=document.getElementById('s1cta'),
    spin=document.getElementById('s1spin'),dl=document.getElementById('s1dl'),
    topTitle=document.getElementById('s1topTitle'),
    form=demo.querySelector('.s1-form'),doc=document.getElementById('s1doc'),
    dtitle=document.getElementById('s1dtitle'),dintro=document.getElementById('s1dintro'),
    bul=document.getElementById('s1bullets'),toast=document.getElementById('s1toast'),
    tfill=document.getElementById('s1tfill'),tsub=document.getElementById('s1tsub'),
    tname=document.getElementById('s1tname'),field=document.getElementById('s1field');
  tname.textContent=TOPIC+'.pdf';
  bul.innerHTML=BULLETS.map(b=>'<li>'+b.replace(/\(([^)]+,\s*\d{4}[^)]*)\)/g,'<span class="s1-cite">($1)</span>')+'</li>').join('');
  async function stream(el,text){const w=text.split(' ');for(let i=0;i<w.length;i++){el.textContent=w.slice(0,i+1).join(' ');await sleep(32);}}
  function showForm(){topTitle.textContent='Novo Trabalho';spin.classList.remove('on');dl.classList.remove('on','pulse');}
  function showThink(){topTitle.textContent='Novo Trabalho';spin.classList.add('on');dl.classList.remove('on');}
  function showDoc(){topTitle.textContent='O teu trabalho';spin.classList.remove('on');dl.classList.add('on');}
  async function downloadToast(){
    dl.classList.add('pulse');await sleep(550);dl.classList.remove('pulse');
    toast.classList.add('on');
    for(let p=0;p<=100;p+=4){tfill.style.width=p+'%';tsub.textContent=(1.6*p/100).toFixed(1).replace('.',',')+' MB de 1,6 MB';await sleep(48);}
    tsub.textContent='Guardado ✓ · 1,6 MB';
    await sleep(1500);toast.classList.remove('on');await sleep(400);tfill.style.width='0';
  }
  async function cycle(){
    bul.querySelectorAll('li').forEach(li=>li.classList.remove('on'));
    dtitle.textContent='';dintro.textContent='';cta.classList.remove('loading');
    toast.classList.remove('on');
    typed.innerHTML='<span class="s1-ph">Escreve aqui…</span>';field.classList.remove('typing');
    form.classList.add('on');doc.classList.remove('on');showForm();await sleep(600);
    typed.innerHTML='';field.classList.add('typing');
    for(let i=1;i<=TOPIC.length;i++){typed.textContent=TOPIC.slice(0,i);await sleep(rnd(20,50));}
    await sleep(380);
    cta.classList.add('loading');showThink();await sleep(900);
    cta.classList.remove('loading');
    form.classList.remove('on');doc.classList.add('on');showDoc();
    await sleep(320);dtitle.textContent=TOPIC;await sleep(160);
    await stream(dintro,INTRO);
    for(const li of bul.querySelectorAll('li')){li.classList.add('on');await sleep(200);}
    await sleep(500);await downloadToast();await sleep(900);cycle();
  }
  if(reduce){
    typed.textContent=TOPIC;form.classList.remove('on');doc.classList.add('on');
    showDoc();dtitle.textContent=TOPIC;dintro.textContent=INTRO;
    bul.querySelectorAll('li').forEach(li=>li.classList.add('on'));return;
  }
  const sio=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){sio.disconnect();setTimeout(cycle,400);}});},{threshold:.25});
  sio.observe(demo);
})();

// Gota de água nos botões — nasce no ponto do toque
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('pointerdown',e=>{
    const r = btn.getBoundingClientRect();
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.left = (e.clientX - r.left) + 'px';
    s.style.top = (e.clientY - r.top) + 'px';
    s.addEventListener('animationend',()=>s.remove());
    btn.appendChild(s);
  });
});
