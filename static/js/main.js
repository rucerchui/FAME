// reveal on scroll
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// count-up stats
function countUp(el){
  const target=+el.dataset.n, suffix=el.dataset.suffix||'', dur=1200, t0=performance.now();
  const fmt=(v)=> (target>=1000? Math.round(v).toLocaleString(): (Number.isInteger(target)? Math.round(v): v.toFixed(1)));
  function step(t){const p=Math.min(1,(t-t0)/dur);const e=1-Math.pow(1-p,3);el.textContent=fmt(target*e)+suffix;if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
const so=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){countUp(e.target);so.unobserve(e.target);}})},{threshold:.5});
document.querySelectorAll('.stat .n[data-n]').forEach(el=>so.observe(el));

// method-family tabs
document.querySelectorAll('.mtab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    const fam=tab.dataset.fam;
    document.querySelectorAll('.mtab').forEach(t=>t.classList.toggle('active',t===tab));
    document.querySelectorAll('.mpanel').forEach(p=>p.classList.toggle('active',p.dataset.fam===fam));
  });
});

// copy bibtex
function copyBib(){
  const t=document.getElementById('bibtex-entry').innerText;
  navigator.clipboard.writeText(t).then(()=>{
    const b=document.getElementById('copybtn');const o=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=o,1600);
  });
}
