'use strict';
const movementDialog = $('#movement-dialog');
let libraryState = {slot:null,group:'all',equipment:'all',target:'all',query:'',page:1,remember:false,fromLibrary:false};
let guideLanguage = 'zh';
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
    <button class="library-card-guide" data-library-guide="${exercise.id}" aria-label="查看 ${escapeHTML(exercise.name)} 动画与要领">
      <span class="library-card-art">${ExerciseArt.thumbnail(exercise)}</span>
      <span class="library-card-text"><small>${exerciseGroupLabel(exercise)}</small><strong>${escapeHTML(exercise.name)}</strong><span>${exercise.equipment}</span><em>${exercise.supplemental?'补充动作 · 原创示意与要领':'#'+exercise.datasetId+' · 动画与中文要领'} ↗</em></span>
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
  if(getPlan().version!==PLAN_VERSION)return '<p class="replacement-help">旧计划只替换本次记录；每周偏好按新版计划单独保存。</p>';
  return `<label class="replacement-scope"><input type="checkbox" data-remember-choice ${libraryState.remember?'checked':''}><span>以后同一训练日也使用<small>不勾选时，只替换 ${selectedDate.getMonth()+1} 月 ${selectedDate.getDate()} 日这次训练</small></span></label>`;
}
function openExerciseLibrary(slot = null, group = 'all') {
  libraryState = {slot,group:slot===null?group:primaryLibraryGroup(EXERCISE_BY_ID[getSession().exerciseIds[slot]]),equipment:'all',target:'all',query:'',page:1,remember:false,fromLibrary:true};
  showMovementDialog();
  renderExerciseLibrary();
}
function renderExerciseLibrary() {
  guideExerciseId = null;
  const current = libraryState.slot===null?null:workoutEntries()[libraryState.slot].exercise;
  $('#movement-content').innerHTML = `<header class="movement-header"><div><p class="eyebrow">FIND YOUR NEXT MOVE</p><h2 id="movement-title" tabindex="-1">${current?'给这个动作，换个选择。':'你的训练动作库。'}</h2></div><button data-close-movement aria-label="关闭动作库">×</button></header>
    <div class="library-context"><label for="replacement-slot">${getPlan().day} · 替换位置</label><select id="replacement-slot">${slotOptions()}</select>
      ${!getPlan().exercises.length?'<p class="muted">今天是恢复日，可浏览全部动作。先切换到训练日，再更换动作。</p>':''}
      <p class="replacement-help">${current?`将替换「${current.name}」，保留这个位置的 ${getPlan().exercises[libraryState.slot][1]} 组，目标次数 / 时长沿用这个位置的计划。原动作记录保留，切回即可继续。有氧或控制位置应选择同类练习，替换后仍沿用该位置的分钟、秒或次数。`:'先浏览动作；想换进训练时，在上方选择要替换的位置。替换后沿用原位置的组数与目标次数 / 时长，可按实际完成情况记录。'}</p>
      ${current?scopeControl():''}
    </div>
    <div class="library-search"><span aria-hidden="true">⌕</span><input id="library-search" type="search" placeholder="搜索动作、肌群或器械" aria-label="搜索动作、肌群或器械" value="${escapeHTML(libraryState.query)}"></div>
    <div class="category-chips dialog-categories" aria-label="按部位筛选">${categoryChips(libraryState.group,'data-library-group')}</div>
    <div class="library-filters"><label>器械<select id="library-equipment">${filterOptions(EQUIPMENT_LABELS,libraryState.equipment,'全部器械')}</select></label><label>目标肌群<select id="library-target">${filterOptions(Object.fromEntries([...new Set(EXERCISE_LIBRARY.map(e=>e.target))].map(key=>[key,muscleLabel(key)])),libraryState.target,'全部肌群')}</select></label><button class="outline-button" data-reset-filters>清除筛选</button></div>
    <p class="dataset-source">1,324 个原库动作 + 8 个计划补充 · <a href="${DATASET_REPOSITORY}" target="_blank" rel="noopener">我的数据集 Fork ↗</a> · © Gym visual — https://gymvisual.com/</p>
    <p id="library-result-count" class="library-result-count" aria-live="polite"></p><div id="library-results" class="library-grid"></div><nav id="library-pagination" class="library-pagination" aria-label="动作库分页"></nav>
    ${current?savedExerciseControls():''}${current?'<div class="restore-original"><button data-restore-original>恢复这个位置的原计划动作 ↶</button><span>按上方勾选的范围生效，原记录仍保留。</span></div>':''}`;
  renderLibraryResults();
  focusMovementTitle();
}
function savedExerciseControls() {
  const slot=libraryState.slot;
  const ids=Object.keys(getSession().alternatives).filter(key=>key.startsWith(`${slot}:`)).map(key=>key.slice(key.indexOf(':')+1));
  if(!ids.length)return '';
  return `<section class="saved-exercises"><p>这个位置保留的动作记录 · 切回可继续</p>${ids.map(id=>`<button class="outline-button" data-use-exercise="${id}">${escapeHTML(EXERCISE_BY_ID[id].name)} ↶</button>`).join('')}</section>`;
}
function primaryLibraryGroup(exercise) {
  return exercise.legacy ? EXERCISE_BY_ID[`ex-${LEGACY_TO_DATASET[exercise.id]}`].groups[0] : exercise.groups[0];
}
function filterOptions(labels,selected,allLabel) {
  return `<option value="all">${allLabel}</option>`+Object.entries(labels).map(([key,label])=>`<option value="${escapeHTML(key)}" ${selected===key?'selected':''}>${escapeHTML(label)}</option>`).join('');
}
function renderLibraryResults() {
  const results=filterExercises(libraryState);
  const page=exercisePage(results,libraryState.page);
  libraryState.page=page.current;
  $('#library-result-count').textContent=`找到 ${page.total.toLocaleString('en-US')} / ${EXERCISE_LIBRARY.length.toLocaleString('en-US')} 个动作 · 第 ${page.current} / ${page.pages} 页${page.total?` · 显示 ${(page.current-1)*48+1}–${Math.min(page.current*48,page.total)}`:''}`;
  $('#library-results').innerHTML=page.items.length?page.items.map(exercise=>libraryCard(exercise)).join(''):'<div class="empty library-empty">没有找到匹配动作。<br>试试清除筛选，或输入英文动作名、中文肌群、器械和动作编号。</div>';
  $('#library-pagination').innerHTML=page.total?`<button data-library-page="${page.current-1}" ${page.current===1?'disabled':''}>← 上一页</button><label>跳至<select id="library-page">${Array.from({length:page.pages},(_,index)=>`<option value="${index+1}" ${page.current===index+1?'selected':''}>第 ${index+1} 页</option>`).join('')}</select></label><button data-library-page="${page.current+1}" ${page.current===page.pages?'disabled':''}>下一页 →</button>`:'';
}
function resetLibraryFilters() {
  Object.assign(libraryState,{group:'all',equipment:'all',target:'all',query:'',page:1});
  renderExerciseLibrary();
}
function openExerciseGuide(id, slot = null, fromLibrary = false) {
  if (!EXERCISE_BY_ID[id]) return;
  if (!fromLibrary) libraryState={slot,group:'all',equipment:'all',target:'all',query:'',page:1,remember:false,fromLibrary:false};
  guideLanguage='zh';
  guideExerciseId = id;
  showMovementDialog();
  renderExerciseGuide();
}
function renderLegacyExerciseGuide() {
  const exercise = EXERCISE_BY_ID[guideExerciseId];
  const canUse = libraryState.slot!==null;
  const isCurrent = canUse && getSession().exerciseIds[libraryState.slot]===exercise.id;
  const sourceName = exercise.source.includes('acefitness')?'ACE':'NASM';
  const sourceLabel = exercise.source.endsWith('/exercise-library/')?'动作库参考':'同类动作参考';
  $('#movement-content').innerHTML = `<header class="movement-header guide-header"><div>${libraryState.fromLibrary?'<button class="guide-back" data-back-library>← 返回动作库</button>':'<p class="eyebrow">LEARN THE MOVEMENT</p>'}<h2 id="movement-title" tabindex="-1">${exercise.name}</h2><p class="guide-tags">${exerciseGroupLabel(exercise)}<span>·</span>${exercise.equipment}</p></div><button data-close-movement aria-label="关闭动作说明">×</button></header>
    <div class="guide-content"><figure class="movement-figure">${ExerciseArt.guide(exercise)}<figcaption>关键姿势示意 · 结合下方要领理解动作，活动范围以可控、舒适为准。</figcaption></figure>
    <div class="guide-muscles"><span>主要训练</span><strong>${exercise.muscles}</strong><span>参考目标</span><strong>${exercise.reps}${exercise.reps.includes('秒')?'':' 次'} / 组</strong></div>
    <section class="guide-setup"><span class="guide-section-label">准备姿势</span><p>${exercise.setup}</p></section>
    <section class="guide-steps"><span class="guide-section-label">动作要领</span><ol>${exercise.cues.map(cue=>`<li>${cue}</li>`).join('')}</ol></section>
    <section class="guide-mistake"><span>注意避免</span><p>${exercise.mistake}</p></section>
    <p class="guide-reference"><a href="${exercise.source}" target="_blank" rel="noopener">${sourceName} · ${sourceLabel} ↗</a><span>本页为中文整理与原创位置示意</span></p></div>
    <footer class="guide-footer">${canUse?(isCurrent?`<p>正在 ${getPlan().day} 的第 ${libraryState.slot+1} 个动作使用</p><button class="primary" data-find-alternative>选择其他动作 ⇄</button>`:`${scopeControl()}<button class="primary" data-use-exercise="${exercise.id}">替换为这个动作 ⇄</button>`):`<p>${getPlan().exercises.length?'想加入今天的训练？先选要替换的位置。':'先切换到训练日，就能把动作换进计划。'}</p><button class="primary" data-find-alternative>返回动作库选择位置 ↗</button>`}</footer>`;
  focusMovementTitle();
}
function renderExerciseGuide() {
  const exercise=EXERCISE_BY_ID[guideExerciseId];
  if(exercise.legacy) {renderLegacyExerciseGuide();return;}
  if(exercise.supplemental){renderSupplementGuide(exercise);return;}
  const canUse=libraryState.slot!==null;
  const isCurrent=canUse&&getSession().exerciseIds[libraryState.slot]===exercise.id;
  const steps=exercise.instruction_steps[guideLanguage];
  const prescription=canUse?getPlan().exercises[libraryState.slot]:null;
  $('#movement-content').innerHTML=`<header class="movement-header guide-header"><div>${libraryState.fromLibrary?'<button class="guide-back" data-back-library>← 返回动作库</button>':'<p class="eyebrow">LEARN THE MOVEMENT</p>'}<h2 id="movement-title" tabindex="-1">${escapeHTML(exercise.name)}</h2><p class="guide-english">${escapeHTML(exercise.englishName)} · #${exercise.datasetId}</p><p class="guide-tags">${exerciseGroupLabel(exercise)}<span>·</span>${exercise.equipment}</p></div><button data-close-movement aria-label="关闭动作说明">×</button></header>
  <div class="guide-content"><figure class="movement-figure dataset-figure">${ExerciseArt.guide(exercise)}<figcaption>动作 GIF · 180 × 180 <a href="${DATASET_REPOSITORY}/blob/${DATASET_REVISION}/${exercise.gif_url}" target="_blank" rel="noopener">打开原图 ↗</a></figcaption></figure>
  <div class="guide-muscles"><span>主要训练</span><strong>${escapeHTML(exercise.muscles)}</strong><span>协同肌群</span><strong>${escapeHTML(exercise.secondaryMuscles||'—')}</strong></div>
  <p class="dataset-plan-note">${prescription?`这个训练位置：${prescription[1]} 组 × ${prescription[2]}。保留原计划目标，请按实际完成情况记录。`:'选择训练位置后，会沿用该位置的组数和目标次数 / 时长。'}</p>
  <section class="guide-steps"><div class="instruction-heading"><span class="guide-section-label">完整动作步骤</span><label>语言<select id="guide-language"><option value="zh" ${guideLanguage==='zh'?'selected':''}>中文</option><option value="en" ${guideLanguage==='en'?'selected':''}>English</option></select></label></div><ol>${steps.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ol></section>
  <p class="guide-reference"><a href="${exercise.source}" target="_blank" rel="noopener">数据集原始记录 ↗</a><span>中文步骤沿用数据集翻译 · 原文可切换查看</span></p></div>
  <footer class="guide-footer">${canUse?(isCurrent?`<p>正在 ${getPlan().day} 的第 ${libraryState.slot+1} 个动作使用</p><button class="primary" data-find-alternative>选择其他动作 ⇄</button>`:`${scopeControl()}<button class="primary" data-use-exercise="${exercise.id}">替换为这个动作 ⇄</button>`):`<p>${getPlan().exercises.length?'想加入今天的训练？先选要替换的位置。':'先切换到训练日，就能把动作换进计划。'}</p><button class="primary" data-find-alternative>返回动作库选择位置 ↗</button>`}</footer>`;
  focusMovementTitle();
}
function renderSupplementGuide(exercise) {
  const canUse=libraryState.slot!==null,isCurrent=canUse&&getSession().exerciseIds[libraryState.slot]===exercise.id;
  $('#movement-content').innerHTML=`<header class="movement-header guide-header"><div>${libraryState.fromLibrary?'<button class="guide-back" data-back-library>← 返回动作库</button>':'<p class="eyebrow">PROGRAM MOVEMENT</p>'}<h2 id="movement-title" tabindex="-1">${exercise.name}</h2><p class="guide-tags">计划补充动作 · ${exerciseGroupLabel(exercise)} · ${exercise.equipment}</p></div><button data-close-movement aria-label="关闭动作说明">×</button></header><div class="guide-content"><figure class="movement-figure">${ExerciseArt.guide(exercise)}<figcaption>原创位置示意 · 结合文字理解动作，不代表医学评估或活动范围要求。</figcaption></figure><div class="guide-muscles"><span>练习重点</span><strong>${exercise.muscles}</strong></div><section class="guide-steps"><p class="guide-section-label">动作要领</p><ol>${exercise.cues.map(cue=>`<li>${escapeHTML(cue)}</li>`).join('')}</ol></section><p class="guide-reference"><a href="${exercise.source}" target="_blank" rel="noopener">${exercise.referenceLabel} ↗</a><span>中文整理与原创示意 · 参考链接可能涉及同类训练原则</span></p>${exercise.demo?`<p class="guide-reference"><a href="${exercise.demo}" target="_blank" rel="noopener">${exercise.demoLabel} ↗</a></p>`:''}</div><footer class="guide-footer">${canUse?(isCurrent?'<p>正在本次训练中使用</p><button class="primary" data-find-alternative>选择其他动作 ⇄</button>':`${scopeControl()}<button class="primary" data-use-exercise="${exercise.id}">替换为这个动作 ⇄</button>`):'<p>可在动作库选择训练位置后使用。</p><button class="primary" data-find-alternative>返回动作库选择位置 ↗</button>'}</footer>`;
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
    libraryState.group=button.dataset.libraryGroup;libraryState.page=1;
    movementDialog.querySelectorAll('[data-library-group]').forEach(chip=>chip.setAttribute('aria-pressed',String(chip===button)));
    renderLibraryResults();
  }
  if(button.hasAttribute('data-library-guide'))openExerciseGuide(button.dataset.libraryGuide,libraryState.slot,true);
  if(button.hasAttribute('data-use-exercise'))applyExerciseChoice(button.dataset.useExercise);
  if(button.hasAttribute('data-library-page')) {
    libraryState.page=Number(button.dataset.libraryPage);renderLibraryResults();
    $('#library-result-count').scrollIntoView({block:'start'});
  }
  if(button.hasAttribute('data-reset-filters'))resetLibraryFilters();
  if(button.hasAttribute('data-find-alternative')){
    if(libraryState.slot!==null)libraryState.group=primaryLibraryGroup(EXERCISE_BY_ID[getSession().exerciseIds[libraryState.slot]]);
    libraryState.fromLibrary=true;renderExerciseLibrary();
  }
  if(button.hasAttribute('data-restore-original'))applyExerciseChoice(originalExerciseIds(getPlan())[libraryState.slot]);
});
movementDialog.addEventListener('input',event=>{
  if(event.target.id==='library-search'){libraryState.query=event.target.value;libraryState.page=1;renderLibraryResults();}
});
movementDialog.addEventListener('change',event=>{
  if(event.target.id==='guide-language'){guideLanguage=event.target.value;renderExerciseGuide();}
  if(event.target.id==='library-equipment'||event.target.id==='library-target') {
    libraryState[event.target.id==='library-equipment'?'equipment':'target']=event.target.value;
    libraryState.page=1;renderLibraryResults();
  }
  if(event.target.id==='library-page') {
    libraryState.page=Number(event.target.value);renderLibraryResults();$('#library-result-count').scrollIntoView({block:'start'});
  }
  if(event.target.hasAttribute('data-remember-choice'))libraryState.remember=event.target.checked;
  if(event.target.id==='replacement-slot'){
    libraryState.slot=event.target.value===''?null:Number(event.target.value);
    renderExerciseLibrary();
  }
});
renderLibraryPreview();
