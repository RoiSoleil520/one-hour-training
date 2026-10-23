// Program dates and exercise records stay in this browser; the public page contains only the schedule.
function programWeek(date=selectedDate) {
  const days=Math.round((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())-Date.UTC(...programStart.split('-').map((value,index)=>Number(value)-(index===1?1:0))))/86400000);
  return Math.floor(days/7)+1;
}
function phaseEffort(){return programWeek()<=2?'余力 3–4 次 · 先建立基线':'余力 2–3 次 · 规范动作优先';}
function renderProgramContext(plan) {
  const week=programWeek();
  $('#program-start').value=programStart;
  $('#program-phase').textContent=week<1?'周期尚未开始':week>8?'8 周周期已结束 · 回顾后再调整':`第 ${week} / 8 周 · ${week<=2?'建立基线':week<=6?'渐进训练':'回顾与调整'}`;
  $('#program-effort').textContent=week<=2?'力量工作组保留 3–4 次余力，固定动作并记录。':week<=6?'多数力量组保留 2–3 次余力，先加次数，再微加重量。':'回顾疼痛反应、动作控制与训练表现；疲劳增加时减少约三分之一工作组。';
  const historical=plan.version!==PLAN_VERSION;
  $('#plan-version-notice').hidden=!historical;
  $('#warmup-copy').textContent=plan.warmup||'这是已保存的旧计划，动作和组数保持当时的安排。';
}
