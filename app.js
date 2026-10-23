'use strict';
const STORAGE_KEY = 'one-hour-journal-v1';
const PLAN_CHOICES_KEY = 'one-hour-plan-choices-v1';
const $ = selector => document.querySelector(selector);
const localDateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const dateFromKey = key => new Date(`${key}T12:00:00`);
const todayKey = localDateKey(new Date());
let selectedDate = dateFromKey(todayKey);
let journal = {};
let planChoices = {};
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (isValidJournal(stored)) journal = stored;
  const storedChoices = JSON.parse(localStorage.getItem(PLAN_CHOICES_KEY) || '{}');
  if (isValidPlanChoices(storedChoices)) planChoices = storedChoices;
} catch { storageAvailable = false; }

function isValidSetList(sets, count) {
  return Array.isArray(sets) && sets.length === count && sets.every(set =>
    set && typeof set.done === 'boolean' && typeof set.weight === 'string' && set.weight.length <= 12 &&
    (set.weight === '' || (Number.isFinite(Number(set.weight)) && Number(set.weight) >= 0 && Number(set.weight) <= 9999)) &&
    typeof set.reps === 'string' && set.reps.length <= 30);
}
function isValidExerciseIds(ids, count) {
  return Array.isArray(ids) && ids.length === count && ids.every(id => typeof id === 'string' && Object.hasOwnProperty.call(EXERCISE_BY_ID, id));
}
function isValidPlanChoices(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.entries(value).every(([day, ids]) => /^[0-4]$/.test(day) && isValidExerciseIds(ids, TRAINING_PLAN[Number(day)].exercises.length));
}
function isValidJournal(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.entries(value).every(([date, session]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || localDateKey(dateFromKey(date)) !== date) return false;
    if (!session || typeof session !== 'object' || Array.isArray(session)) return false;
    if (typeof session.note !== 'string' || session.note.length > 1000 || !Array.isArray(session.exercises)) return false;
    const plan = TRAINING_PLAN[(dateFromKey(date).getDay()+6)%7];
    if (session.exercises.length !== plan.exercises.length) return false;
    if (session.exerciseIds !== undefined && !isValidExerciseIds(session.exerciseIds, plan.exercises.length)) return false;
    if (!session.exercises.every((sets, index) => isValidSetList(sets, plan.exercises[index][1]))) return false;
    if (session.alternatives === undefined) return true;
    if (!session.alternatives || typeof session.alternatives !== 'object' || Array.isArray(session.alternatives)) return false;
    return Object.entries(session.alternatives).every(([key, sets]) => {
      const match = /^(\d+):([a-z0-9-]+)$/.exec(key);
      if (!match || !Object.hasOwnProperty.call(EXERCISE_BY_ID, match[2])) return false;
      const slot = plan.exercises[Number(match[1])];
      return slot && isValidSetList(sets, slot[1]);
    });
  });
}
function getPlan(date = selectedDate) { return TRAINING_PLAN[(date.getDay()+6)%7]; }
function getMonday(date = selectedDate) {
  const monday = new Date(date);
  monday.setDate(monday.getDate() - (monday.getDay()+6)%7);
  return monday;
}
function emptySets(count) {
  return Array.from({length:count}, () => ({weight:'', reps:'', done:false}));
}
function getSession(date = selectedDate) {
  const plan = getPlan(date);
  const stored = journal[localDateKey(date)];
  // Legacy records keep the original exercise names, even after a weekly template changes.
  if (stored) return {...stored, exerciseIds:stored.exerciseIds || legacyExerciseIds(plan), alternatives:stored.alternatives || {}};
  const dayIndex = (date.getDay()+6)%7;
  return {
    note:'',
    exerciseIds:[...(planChoices[dayIndex] || originalExerciseIds(plan)).map(id => EXERCISE_BY_ID[id].legacy ? `ex-${LEGACY_TO_DATASET[id]}` : id)],
    alternatives:{},
    exercises:plan.exercises.map(([,count]) => emptySets(count))
  };
}
function workoutEntries(date = selectedDate) {
  const plan = getPlan(date);
  const session = getSession(date);
  return plan.exercises.map(([name,count,target],index) => {
    const exercise = EXERCISE_BY_ID[session.exerciseIds[index]];
    return {exercise, count, target};
  });
}
function replaceExercise(slot, exerciseId, remember) {
  const session = getSession();
  const oldId = session.exerciseIds[slot];
  if (!EXERCISE_BY_ID[exerciseId] || !session.exercises[slot]) return;
  if (oldId !== exerciseId) {
    session.alternatives[`${slot}:${oldId}`] = session.exercises[slot];
    session.exercises[slot] = session.alternatives[`${slot}:${exerciseId}`] || emptySets(getPlan().exercises[slot][1]);
    session.exerciseIds[slot] = exerciseId;
  }
  if (remember) {
    // Existing sessions keep their saved IDs; recurring choices only affect sessions not started yet.
    const dayIndex = (selectedDate.getDay()+6)%7;
    planChoices[dayIndex] = [...(planChoices[dayIndex] || originalExerciseIds(getPlan()))];
    planChoices[dayIndex][slot] = exerciseId;
  }
  persistSession(session);
  renderWeek(); renderWorkout();
  const changed = document.querySelector(`.exercise[data-exercise="${slot}"]`);
  if (changed) changed.open = true;
}
function sessionStats(date) {
  const sets = getSession(date).exercises.flat();
  return {done:sets.filter(set=>set.done).length,total:sets.length};
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
let toastTimeout;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(()=>$('#toast').classList.remove('show'),3500);
}
function persistSession(session) {
  journal[localDateKey(selectedDate)] = session;
  try {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(journal));
    localStorage.setItem(PLAN_CHOICES_KEY,JSON.stringify(planChoices));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
    toast('浏览器无法保存，请在「我的记录」中导出备份。');
  }
  updateStorageHint();
}
function updateStorageHint() {
  $('#save-hint').textContent = storageAvailable
    ? '记录自动保存在当前浏览器，可在「我的记录」中导出备份。'
    : '当前浏览器无法持久保存。关闭页面前，请在「我的记录」中导出备份。';
}
function renderWeek() {
  const monday = getMonday();
  const sunday = new Date(monday); sunday.setDate(sunday.getDate()+6);
  $('#week-range').textContent = `${monday.getFullYear()}.${monday.getMonth()+1}.${monday.getDate()} — ${sunday.getMonth()+1}.${sunday.getDate()}`;
  let completed = 0;
  $('#days').innerHTML = TRAINING_PLAN.map((plan,index) => {
    const date = new Date(monday); date.setDate(date.getDate()+index);
    const key = localDateKey(date);
    const stats = sessionStats(date);
    const finished = stats.total > 0 && stats.done === stats.total;
    if (finished) completed++;
    return `<button class="day ${index>4?'rest':''}" role="tab" aria-selected="${key === localDateKey(selectedDate)}" aria-controls="workout" data-date="${key}" id="day-${index}" tabindex="${key === localDateKey(selectedDate)?0:-1}"><span class="day-top">${plan.day} · ${date.getDate()}${key===todayKey?'<i class="day-today" title="今天"></i>':''}</span><span class="day-symbol">${finished?'✓':plan.symbol}</span><span class="day-name">${plan.short}</span><span class="day-bottom">${index>4?'放松 & 恢复':finished?'今日已完成':stats.done?`${stats.done} / ${stats.total} 组`:'60 MIN · 力量训练'}</span></button>`;
  }).join('');
  $('#week-complete').textContent = `${completed} / 5`;
}
function renderWorkout() {
  const plan = getPlan();
  const session = getSession();
  $('#day-label').textContent = `${plan.english} / ${plan.day} · ${selectedDate.getMonth()+1} 月 ${selectedDate.getDate()} 日`;
  $('#workout-title').textContent = plan.title;
  const customized = session.exerciseIds.some((id,index) => id !== originalExerciseIds(plan)[index]);
  const currentGroups = [...new Set(workoutEntries().map(({exercise})=>exerciseGroupLabel(exercise)))].join('、');
  $('#muscles').textContent = plan.exercises.length ? (customized?`当前动作覆盖：${currentGroups}`:`目标肌群：${plan.muscles}`) : plan.muscles;
  $('.session-flow').hidden = !plan.exercises.length;
  $('#exercise-count').textContent = `${plan.exercises.length} 个动作`;
  $('#day-note').innerHTML = `<strong>↗ ${plan.exercises.length?(customized?'原计划训练重点':'今天的训练重点'):'今天的恢复笔记'}</strong>${plan.note}`;
  $('#session-note').value = session.note;
  if (!plan.exercises.length) {
    $('#exercises').innerHTML = '<div class="rest-content"><span>⌁</span><h3>放慢一点，也是在前进。</h3><p>散个步，伸展一下，或者好好休息。<br>今天的任务，是让身体恢复能量。</p></div>';
    updateProgress(); return;
  }
  const firstIncomplete = session.exercises.findIndex(sets=>sets.some(set=>!set.done));
  $('#exercises').innerHTML = workoutEntries().map(({exercise,count,target},exerciseIndex) => {
    const name = exercise.name;
    const timed = target.includes('秒');
    const replaced = exercise.id !== originalExerciseIds(plan)[exerciseIndex];
    return `<details class="exercise" data-exercise="${exerciseIndex}" ${exerciseIndex===firstIncomplete?'open':''}>
      <summary><span class="exercise-number">${String(exerciseIndex+1).padStart(2,'0')}</span>
        <span class="exercise-name">${name}<small>${replaced?'已替换 · ':''}${exerciseGroupLabel(exercise)} · ${exercise.equipment}</small></span>
        <span class="exercise-prescription">${count} × ${target}<small>${timed?'组 × 时长':'组 × 次数'}</small></span><span class="expand-icon" aria-hidden="true">+</span>
      </summary>
      ${exercise.legacy?'<p class="dataset-plan-note">旧版已保存动作 · 记录仍属于原动作，可从新动作库更换。</p>':`<p class="dataset-plan-note">原计划位置：${plan.exercises[exerciseIndex][0]} · 当前采用库中所示变式，目标沿用此位置的次数 / 时长。</p>`}<div class="exercise-learning">
        <button class="exercise-preview" data-guide="${exercise.id}" data-slot="${exerciseIndex}" aria-label="查看${name}动作示意与要领">${ExerciseArt.thumbnail(exercise)}<span>示意图 ↗</span></button>
        <div class="exercise-learning-copy"><span class="eyebrow">MOVE WITH INTENTION</span><p>${exercise.cues[0]}</p>
          <div class="exercise-tools"><button data-guide="${exercise.id}" data-slot="${exerciseIndex}">动作要领 ↗</button><button data-replace="${exerciseIndex}">更换动作 ⇄</button></div>
        </div>
      </div>
      <div class="set-table"><div class="set-header"><span>组</span><span>重量 / kg</span><span>${timed?'时长 / 秒':'实际次数'}</span><span>完成</span></div>
      ${session.exercises[exerciseIndex].map((set,setIndex)=>`<div class="set-row"><span>${String(setIndex+1).padStart(2,'0')}</span><input type="number" min="0" max="9999" step="0.5" inputmode="decimal" data-field="weight" data-exercise="${exerciseIndex}" data-set="${setIndex}" aria-label="${name} 第${setIndex+1}组重量 kg" value="${escapeHTML(set.weight)}" placeholder="自重可留空"><input type="text" inputmode="numeric" maxlength="30" data-field="reps" data-exercise="${exerciseIndex}" data-set="${setIndex}" aria-label="${name} 第${setIndex+1}组${timed?'时长':'次数'}" value="${escapeHTML(set.reps)}" placeholder="${target}"><input class="set-check" type="checkbox" data-field="done" data-exercise="${exerciseIndex}" data-set="${setIndex}" aria-label="完成${name}第${setIndex+1}组" ${set.done?'checked':''}></div>`).join('')}</div>
    </details>`;
  }).join('');
  updateProgress();
}
function updateProgress() {
  const {done,total} = sessionStats(selectedDate);
  $('#set-progress').textContent = total ? `${done} / ${total} 组完成` : '今日恢复日';
  $('#progress-bar').style.width = `${total?done/total*100:0}%`;
  document.querySelectorAll('.exercise').forEach(element=>{
    const sets = getSession().exercises[Number(element.dataset.exercise)];
    const finished = sets.every(set=>set.done);
    element.classList.toggle('done',finished);
    element.querySelector('.exercise-number').textContent = finished?'✓':String(Number(element.dataset.exercise)+1).padStart(2,'0');
  });
}
function selectDate(date,focusTab = false) {
  selectedDate = date;
  renderWeek(); renderWorkout();
  if (focusTab) $(`[data-date="${localDateKey(date)}"]`).focus();
}
$('#days').addEventListener('click',event=>{
  const button = event.target.closest('[data-date]');
  if (button) selectDate(dateFromKey(button.dataset.date));
});
$('#days').addEventListener('keydown',event=>{
  const directions = {ArrowRight:1,ArrowLeft:-1};
  if (!directions[event.key] && !['Home','End'].includes(event.key)) return;
  event.preventDefault();
  const date = event.key==='Home'?getMonday():event.key==='End'?getMonday():new Date(selectedDate);
  date.setDate(date.getDate()+(event.key==='End'?6:(directions[event.key]||0)));
  selectDate(date,true);
});
$('#prev-week').onclick = ()=>{const date = new Date(selectedDate);date.setDate(date.getDate()-7);selectDate(date);};
$('#next-week').onclick = ()=>{const date = new Date(selectedDate);date.setDate(date.getDate()+7);selectDate(date);};
$('#today').onclick = ()=>selectDate(dateFromKey(todayKey));
$('#exercises').addEventListener('input',event=>{
  const input = event.target;
  const field = input.dataset.field;
  if (!field) return;
  if (field==='weight' && !input.validity.valid) return;
  const session = getSession();
  session.exercises[Number(input.dataset.exercise)][Number(input.dataset.set)][field] = field==='done'?input.checked:input.value;
  persistSession(session);
  if (field==='done') {
    updateProgress();renderWeek();
    const {done,total} = sessionStats(selectedDate);
    if (done===total) toast('今天的训练完成了！给认真到场的自己一个赞。');
  }
});
$('#session-note').addEventListener('input',event=>{
  const session = getSession();session.note = event.target.value;persistSession(session);
});
$('#copy-plan').onclick = async()=>{
  const plan = getPlan();
  const text = `${plan.day}｜${plan.title}\n${plan.exercises.length?'热身 8 分钟 · 力量 45 分钟 · 整理 7 分钟\n':''}${workoutEntries().map(({exercise,count,target},i)=>`${i+1}. ${exercise.name}：${count} × ${target}`).join('\n')}\n${plan.note}`;
  try {await navigator.clipboard.writeText(text);toast('当天计划已复制');}
  catch {toast('复制未成功，请允许浏览器访问剪贴板后重试。');}
};

// Deadline-based timing remains accurate when the tab is in the background.
let restSeconds = 90;
let remainingSeconds = 90;
let timerDeadline = null;
let timerInterval = null;
function renderTimer() {
  $('#timer-display').textContent = `${String(Math.floor(remainingSeconds/60)).padStart(2,'0')}:${String(remainingSeconds%60).padStart(2,'0')}`;
  $('#timer-toggle').innerHTML = timerDeadline?'暂停计时 <span>Ⅱ</span>':`${remainingSeconds===restSeconds?'开始休息':'继续计时'} <span>▶</span>`;
}
function stopTimer() {clearInterval(timerInterval);timerInterval=null;timerDeadline=null;}
function tickTimer() {
  remainingSeconds = Math.max(0,Math.ceil((timerDeadline-Date.now())/1000));
  if (remainingSeconds===0) {
    stopTimer();
    $('#timer-status').textContent = '休息结束，准备好就开始下一组。';
    toast('休息结束，准备下一组！');
    remainingSeconds = restSeconds;
  }
  renderTimer();
}
$('#timer-toggle').onclick = ()=>{
  if (timerDeadline) {remainingSeconds=Math.max(1,Math.ceil((timerDeadline-Date.now())/1000));stopTimer();renderTimer();return;}
  timerDeadline=Date.now()+remainingSeconds*1000;
  $('#timer-status').textContent='放松呼吸，让身体恢复一下。';
  timerInterval=setInterval(tickTimer,250);renderTimer();
};
$('#timer-reset').onclick=()=>{stopTimer();remainingSeconds=restSeconds;$('#timer-status').textContent='一般组间 60–90 秒，复合动作 90–120 秒';renderTimer();};
$('.timer-presets').addEventListener('click',event=>{
  const button=event.target.closest('[data-seconds]');if(!button)return;
  stopTimer();restSeconds=Number(button.dataset.seconds);remainingSeconds=restSeconds;
  document.querySelectorAll('[data-seconds]').forEach(item=>item.classList.toggle('selected',item===button));
  $('#timer-status').textContent=`已选择 ${restSeconds} 秒休息`;renderTimer();
});
document.addEventListener('visibilitychange',()=>{if(timerDeadline)tickTimer();});
function renderHistory() {
  const dates = Object.keys(journal).filter(key=>{
    const session=journal[key];
    const allSets = [...session.exercises.flat(), ...Object.values(session.alternatives || {}).flat()];
    return session.note || allSets.some(set=>set.done||set.weight||set.reps);
  }).sort().reverse();
  $('#history-list').innerHTML=dates.length?dates.map(key=>{
    const date=dateFromKey(key), stats=sessionStats(date);
    return `<button class="history-item" data-history-date="${key}"><span><b>${key} · ${getPlan(date).short}</b><small>${escapeHTML((journal[key].note||'认真训练的一天。').slice(0,65))}</small></span><span>${stats.total?`${stats.done} / ${stats.total} 组`:'恢复日'} ↗</span></button>`;
  }).join(''):'<div class="empty">还没有训练记录。<br>从完成第一组开始，积累自己的训练日常。</div>';
}
$('#history-open').onclick=()=>{renderHistory();$('#history-dialog').showModal();};
$('#history-close').onclick=()=>$('#history-dialog').close();
$('#history-list').onclick=event=>{
  const button=event.target.closest('[data-history-date]');if(!button)return;
  selectDate(dateFromKey(button.dataset.historyDate));$('#history-dialog').close();$('#workout').scrollIntoView({behavior:'smooth'});
};
$('#export-data').onclick=()=>{
  const data=JSON.stringify({version:2,exportedAt:new Date().toISOString(),journal,planChoices},null,2);
  const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=`one-hour-records-${todayKey}.json`;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);toast('训练记录已导出');
};
$('#import-data').onchange=async event=>{
  const file=event.target.files[0];if(!file)return;
  try {
    if(file.size>5*1024*1024)throw new Error('备份文件不能超过 5 MB。');
    const data=JSON.parse(await file.text());
    if(![1,2].includes(data.version)||!isValidJournal(data.journal)||(data.version===2&&!isValidPlanChoices(data.planChoices)))throw new Error('备份格式不正确，请选择一小时导出的 JSON 文件。');
    // Preserve existing local sessions. Import only dates not already present.
    let added=0;
    for(const [date,session] of Object.entries(data.journal))if(!Object.hasOwnProperty.call(journal,date)){journal[date]=session;added++;}
    if(data.version===2) for(const [day,ids] of Object.entries(data.planChoices)) if(!Object.hasOwnProperty.call(planChoices,day)) planChoices[day]=ids;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(journal));localStorage.setItem(PLAN_CHOICES_KEY,JSON.stringify(planChoices));storageAvailable=true;}catch{storageAvailable=false;}
    renderWeek();renderWorkout();renderHistory();updateStorageHint();
    toast(`已导入 ${added} 天记录；同日期和已有每周设置保留本机内容。${storageAvailable?'':'请导出备份，当前浏览器无法保存。'}`);
  }catch(error){toast(error.message || '导入失败，文件不是有效的 JSON 备份。');}
  event.target.value='';
};
renderWeek();renderWorkout();renderTimer();updateStorageHint();
