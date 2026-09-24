// Helpers reutilizáveis das animações Dookia
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

async function typeInto(el, text, cps){
  el.textContent = "";
  for(const ch of text){ el.textContent += ch; await wait(1000/cps); }
}
async function streamInto(el, text, wps){
  el.textContent = "";
  for(const word of text.split(" ")){ el.textContent += word + " "; await wait(1000/wps); }
}
// Toque mobile com ripple no ponto (elemento alvo, container p/ posicionar)
async function touchAt(target, origin, ms=550){
  const t = target.getBoundingClientRect(), o = origin.getBoundingClientRect();
  const s = document.createElement('span');
  s.className = 'touch';
  s.style.left = (t.left - o.left + t.width/2) + 'px';
  s.style.top = (t.top - o.top + t.height/2) + 'px';
  origin.appendChild(s);
  await wait(60);
  s.classList.add('go');
  await wait(ms);
  s.remove();
}
