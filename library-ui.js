'use strict';
const movementDialog = $('#movement-dialog');
let libraryState = {slot:null, group:'all', query:'', remember:false, fromLibrary:false};
let previewGroup = 'all';
let guideExerciseId = null;
let movementTrigger = null;

function categoryChips(selected, attribute) {
  return [['all','全部'],...Object.entries(EXERCISE_GROUPS)].map(([key,label]) => {
    const count = EXERCISE_LIBRARY.filter(exercise=>key==='all'||exercise.groups.includes(key)).length;
    return `<button ${attribute}="${key}" aria-pressed="${selected===key}">${label}<small>${count}</small></button>`;
  }).join('');
}
function libraryCard(exercise, compact = false) {
  const active = libraryState.slot !== null && getSession().exerciseIds[libraryState.slot] === exercise.id;
  return `<article class="library-card">
    <button class="library-card-guide" data-library-guide="${exercise.id}" aria-label="查看${exercise.name}示意图与要领">
      <span class="library-card-art">${ExerciseArt.thumbnail(exercise)}</span>
      <span class="library-card-text"><small>${exercise.groups.map(group=>EXERCISE_GROUPS[group]).join(' / ')}</small><strong>${exercise.name}</strong><span>${exercise.equipment}</span><em>示意图与动作要领 ↗</em></span>
    </button>
    ${!compact&&libraryState.slot!==null?`<button class="library-use ${active?'is-current':''}" data-use-exercise="${exercise.id}" ${active?'disabled':''}>${active?'当前动作 ✓':'换成这个动作 ⇄'}</button>`:''}
  </article>`;
}
function renderLibraryPreview() {
  $('#library-preview-groups').innerHTML = categoryChips(previewGroup,'data-preview-group');
  const exercises = EXERCISE_LIBRARY.filter(exercise=>previewGroup==='all'||exercise.groups.includes(previewGroup));
  $('#library-preview-cards').innerHTML = exercises.slice(0,6).map(exercise=>libraryCard(exercise,true)).join('');
  $('#library-more').textContent = `浏览${previewGroup==='all'?'全部':EXERCISE_GROUPS[previewGroup]} ${exercises.length} 个动作 ↗`;
}
function showMovementDialog() {
  if (!movementDialog.open) {
    movementTrigger = document.activeElement;
    movementDialog.showModal();
    document.body.classList.add('movement-open');
  }
}
function focusMovementTitle() {
  movementDialog.scrollTop = 0;
  $('#movement-title').focus({preventScroll:true});
}
function closeMovementDialog() {
  movementDialog.close();
}
movementDialog.addEventListener('close',()=>{
  document.body.classList.remove('movement-open');
  if(movementTrigger?.isConnected)movementTrigger.focus({preventScroll:true});
});
function slotOptions() {
  return '<option value="">仅浏览动作</option>'+workoutEntries().map(({exercise},slot)=>`<option value="${slot}" ${slot===libraryState.slot?'selected':''}>第 ${slot+1} 个 · ${exercise.name}</option>`).join('');
}
function scopeControl() {
  return `<label class="replacement-scope"><input type="checkbox" data-remember-choice ${libraryState.remember?'checked':''}><span>以后同一训练日也使用<small>不勾选时，只替换 ${selectedDate.getMonth()+1} 月 ${selectedDate.getDate()} 日这次训练</small></span></label>`;
}
function openExerciseLibrary(slot = null, group = 'all') {
  libraryState = {slot,group:slot===null?group:EXERCISE_BY_ID[getSession().exerciseIds[slot]].groups[0],query:'',remember:false,fromLibrary:true};
  showMovementDialog();
  renderExerciseLibrary();
}
function renderExerciseLibrary() {
  guideExerciseId = null;
  const current = libraryState.slot===null?null:workoutEntries()[libraryState.slot].exercise;
  $('#movement-content').innerHTML = `<header class="movement-header"><div><p class="eyebrow">FIND YOUR NEXT MOVE</p><h2 id="movement-title" tabindex="-1">${current?'给这个动作，换个选择。':'你的训练动作库。'}</h2></div><button data-close-movement aria-label="关闭动作库">×</button></header>
    <div class="library-context"><label for="replacement-slot">${getPlan().day} · 替换位置</label><select id="replacement-slot">${slotOptions()}</select>
      ${!getPlan().exercises.length?'<p class="muted">今天是恢复日，可浏览全部动作。先切换到训练日，再更换动作。</p>':''}
      <p class="replacement-help">${current?`将替换「${current.name}」，保留这个位置的 ${getPlan().exercises[libraryState.slot][1]} 组，目标次数采用新动作建议。原动作记录保留，切回即可继续。`:'先浏览动作；想换进训练时，在上方选择要替换的位置。'}</p>
      ${current?scopeControl():''}
    </div>
    <div class="library-search"><span aria-hidden="true">⌕</span><input id="library-search" type="search" placeholder="搜索动作、肌群或器械" aria-label="搜索动作、肌群或器械" value="${escapeHTML(libraryState.query)}"></div>
    <div class="category-chips dialog-categories" aria-label="按部位筛选">${categoryChips(libraryState.group,'data-library-group')}</div>
    <p id="library-result-count" class="library-result-count" aria-live="polite"></p><div id="library-results" class="library-grid"></div>
    ${current?'<div class="restore-original"><button data-restore-original>恢复这个位置的原计划动作 ↶</button><span>按上方勾选的范围生效，原记录仍保留。</span></div>':''}`;
  renderLibraryResults();
  focusMovementTitle();
}
function renderLibraryResults() {
  const query = libraryState.query.trim().toLowerCase();
  const results = EXERCISE_LIBRARY.filter(exercise=>
    (libraryState.group==='all'||exercise.groups.includes(libraryState.group)) &&
    `${exercise.name} ${exercise.muscles} ${exercise.equipment} ${exercise.groups.map(group=>EXERCISE_GROUPS[group]).join(' ')}`.toLowerCase().includes(query));
  $('#library-result-count').textContent = `${libraryState.group==='all'?'全部动作':EXERCISE_GROUPS[libraryState.group]} · 找到 ${results.length} 个动作`;
  $('#library-results').innerHTML = results.length?results.map(exercise=>libraryCard(exercise)).join(''):'<div class="empty library-empty">没有找到匹配动作。<br>试试其他部位、器械或更短的关键词。</div>';
}
function openExerciseGuide(id, slot = null, fromLibrary = false) {
  if (!EXERCISE_BY_ID[id]) return;
  if (!fromLibrary) libraryState={slot,group:'all',query:'',remember:false,fromLibrary:false};
  guideExerciseId = id;
  showMovementDialog();
  renderExerciseGuide();
}
function renderExerciseGuide() {
  const exercise = EXERCISE_BY_ID[guideExerciseId];
  const canUse = libraryState.slot!==null;
  const isCurrent = canUse && getSession().exerciseIds[libraryState.slot]===exercise.id;
  const sourceName = exercise.source.includes('acefitness')?'ACE':'NASM';
  const sourceLabel = exercise.source.endsWith('/exercise-library/')?'动作库参考':'同类动作参考';
  $('#movement-content').innerHTML = `<header class="movement-header guide-header"><div>${libraryState.fromLibrary?'<button class="guide-back" data-back-library>← 返回动作库</button>':'<p class="eyebrow">LEARN THE MOVEMENT</p>'}<h2 id="movement-title" tabindex="-1">${exercise.name}</h2><p class="guide-tags">${exercise.groups.map(group=>EXERCISE_GROUPS[group]).join(' / ')}<span>·</span>${exercise.equipment}</p></div><button data-close-movement aria-label="关闭动作说明">×</button></header>
    <div class="guide-content"><figure class="movement-figure">${ExerciseArt.guide(exercise)}<figcaption>关键姿势示意 · 结合下方要领理解动作，活动范围以可控、舒适为准。</figcaption></figure>
    <div class="guide-muscles"><span>主要训练</span><strong>${exercise.muscles}</strong><span>参考目标</span><strong>${exercise.reps}${exercise.reps.includes('秒')?'':' 次'} / 组</strong></div>
    <section class="guide-setup"><span class="guide-section-label">准备姿势</span><p>${exercise.setup}</p></section>
    <section class="guide-steps"><span class="guide-section-label">动作要领</span><ol>${exercise.cues.map(cue=>`<li>${cue}</li>`).join('')}</ol></section>
    <section class="guide-mistake"><span>注意避免</span><p>${exercise.mistake}</p></section>
    <p class="guide-reference"><a href="${exercise.source}" target="_blank" rel="noopener">${sourceName} · ${sourceLabel} ↗</a><span>本页为中文整理与原创位置示意</span></p></div>
    <footer class="guide-footer">${canUse?(isCurrent?`<p>正在 ${getPlan().day} 的第 ${libraryState.slot+1} 个动作使用</p><button class="primary" data-find-alternative>选择其他动作 ⇄</button>`:`${scopeControl()}<button class="primary" data-use-exercise="${exercise.id}">替换为这个动作 ⇄</button>`):`<p>${getPlan().exercises.length?'想加入今天的训练？先选要替换的位置。':'先切换到训练日，就能把动作换进计划。'}</p><button class="primary" data-find-alternative>返回动作库选择位置 ↗</button>`}</footer>`;
  focusMovementTitle();
}
function applyExerciseChoice(id) {
  if (libraryState.slot===null) return;
  const slot = libraryState.slot;
  const exercise = EXERCISE_BY_ID[id];
  replaceExercise(slot,id,libraryState.remember);
  closeMovementDialog();
  document.querySelector(`.exercise[data-exercise="${slot}"] [data-guide]`)?.focus({preventScroll:true});
  toast(`已换为${exercise.name}。${libraryState.remember?'未开始的同一训练日也会使用。':'仅本次生效。'}原动作记录已保留。`);
}
$('#library-open').onclick = ()=>openExerciseLibrary();
$('#library-more').onclick = ()=>openExerciseLibrary(null,previewGroup);
$('#library-preview-groups').onclick = event=>{
  const button=event.target.closest('[data-preview-group]');
  if(button){previewGroup=button.dataset.previewGroup;renderLibraryPreview();}
};
$('#library-preview-cards').onclick = event=>{
  const button=event.target.closest('[data-library-guide]');
  if(button){openExerciseLibrary(null,previewGroup);openExerciseGuide(button.dataset.libraryGuide,null,true);}
};
$('#exercises').addEventListener('click',event=>{
  const guide = event.target.closest('[data-guide]');
  const replace = event.target.closest('[data-replace]');
  if(guide)openExerciseGuide(guide.dataset.guide,Number(guide.dataset.slot));
  if(replace)openExerciseLibrary(Number(replace.dataset.replace));
});
movementDialog.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-close-movement'))closeMovementDialog();
  if(button.hasAttribute('data-back-library'))renderExerciseLibrary();
  if(button.hasAttribute('data-library-group')){
    libraryState.group=button.dataset.libraryGroup;
    movementDialog.querySelectorAll('[data-library-group]').forEach(chip=>chip.setAttribute('aria-pressed',String(chip===button)));
    renderLibraryResults();
  }
  if(button.hasAttribute('data-library-guide'))openExerciseGuide(button.dataset.libraryGuide,libraryState.slot,true);
  if(button.hasAttribute('data-use-exercise'))applyExerciseChoice(button.dataset.useExercise);
  if(button.hasAttribute('data-find-alternative')){
    if(libraryState.slot!==null)libraryState.group=EXERCISE_BY_ID[getSession().exerciseIds[libraryState.slot]].groups[0];
    libraryState.fromLibrary=true;renderExerciseLibrary();
  }
  if(button.hasAttribute('data-restore-original'))applyExerciseChoice(originalExerciseIds(getPlan())[libraryState.slot]);
});
movementDialog.addEventListener('input',event=>{
  if(event.target.id==='library-search'){libraryState.query=event.target.value;renderLibraryResults();}
});
movementDialog.addEventListener('change',event=>{
  if(event.target.hasAttribute('data-remember-choice'))libraryState.remember=event.target.checked;
  if(event.target.id==='replacement-slot'){
    libraryState.slot=event.target.value===''?null:Number(event.target.value);
    renderExerciseLibrary();
  }
});
renderLibraryPreview();
