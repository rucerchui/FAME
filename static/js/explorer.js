// FAME Dataset Explorer — interactive filter + view-toggle over real samples
(function(){
  const S = window.FAME_SAMPLES || [];
  const grid = document.getElementById('explorerGrid');
  if(!grid || !S.length) return;

  const ORGAN_LABEL = {brain:'Brain',breast:'Breast',colon:'Colon',lung:'Lung',retina:'Retina',skin:'Skin',thyroid:'Thyroid'};
  const state = {organ:'all', modality:'all', view:'overlay'};

  // build filter chips
  const organs = [...new Set(S.map(s=>s.organ))];
  const modalities = [...new Set(S.map(s=>s.modality))];
  const organBox = document.getElementById('organFilters');
  const modBox = document.getElementById('modalityFilters');
  organs.forEach(o=>{
    const b=document.createElement('button');b.className='chip';b.dataset.val=o;
    b.textContent=ORGAN_LABEL[o]||o;organBox.appendChild(b);
  });
  modalities.forEach(m=>{
    const b=document.createElement('button');b.className='chip';b.dataset.val=m;
    b.textContent=m;modBox.appendChild(b);
  });

  function base(ds){return 'static/samples/'+ds;}
  function cardHTML(s){
    const src = base(s.dataset)+'_'+state.view+'.jpg';
    const zoom = s.zoom ? '<span class="zoombadge" title="Cropped around the ROI">⤢ zoom</span>' : '';
    return `
    <figure class="excard" data-organ="${s.organ}" data-modality="${s.modality}">
      <div class="exthumb">
        <img src="${src}" alt="${s.name} ${state.view}" loading="lazy">
        <span class="exdot dot-${s.organ}"></span>
        ${zoom}
      </div>
      <figcaption>
        <div class="exname">${s.name}</div>
        <div class="exmeta"><span>${ORGAN_LABEL[s.organ]||s.organ}</span> · <span>${s.modality}</span></div>
        <div class="extarget">${s.target}</div>
        <div class="exfg"><span class="exfgbar"><i style="width:${Math.min(100,s.fg*2.2).toFixed(1)}%"></i></span><span class="exfgv">${s.fg}% FG</span></div>
      </figcaption>
    </figure>`;
  }

  function render(){
    const list = S.filter(s=>(state.organ==='all'||s.organ===state.organ) &&
                             (state.modality==='all'||s.modality===state.modality));
    grid.innerHTML = list.map(cardHTML).join('');
    const c=document.getElementById('expCount'); if(c) c.textContent=list.length;
    // re-observe for reveal
    grid.querySelectorAll('.excard').forEach((el,i)=>{el.style.setProperty('--d', (i%8)*40+'ms');});
  }

  // filter chip handlers
  document.querySelectorAll('.exp-filtergroup').forEach(g=>{
    const grp=g.dataset.group;
    g.addEventListener('click',e=>{
      const btn=e.target.closest('button.chip'); if(!btn) return;
      g.querySelectorAll('.chip').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state[grp]=btn.dataset.val;
      render();
    });
  });
  // view toggle
  document.getElementById('viewToggle').addEventListener('click',e=>{
    const btn=e.target.closest('button.vbtn'); if(!btn) return;
    document.querySelectorAll('#viewToggle .vbtn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.view=btn.dataset.view;
    render();
  });
  // click a card to cycle its view individually
  grid.addEventListener('click',e=>{
    const card=e.target.closest('.excard'); if(!card) return;
    const img=card.querySelector('img');
    const ds=card.querySelector('.exname').textContent;
    const s=S.find(x=>x.name===ds); if(!s) return;
    const order=['overlay','img','mask'];
    const cur=img.src.match(/_(overlay|img|mask)\.jpg/);
    let idx=cur?order.indexOf(cur[1]):0;
    idx=(idx+1)%order.length;
    img.src=base(s.dataset)+'_'+order[idx]+'.jpg';
    card.classList.add('flash');setTimeout(()=>card.classList.remove('flash'),260);
  });

  render();
})();
