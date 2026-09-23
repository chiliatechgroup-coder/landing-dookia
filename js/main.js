const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

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
