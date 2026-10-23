/* The original five-day plan. Reps are work sets; warm-up sets are excluded. */
const PREVIOUS_TRAINING_PLAN = [
  {day:'周一',short:'背 + 二头',english:'PULL DAY',title:'背部 + 肱二头肌',muscles:'背阔肌、大圆肌、菱形肌、斜方肌、肱二头肌',symbol:'↙',note:'注意肩胛自然活动，避免全程强行夹紧或下压肩胛。',exercises:[['宽距对握高位下拉',3,'10–12'],['胸托划船',3,'10–12'],['坐姿绳索划船',2,'12'],['绳索面拉',3,'12–15'],['哑铃弯举',2,'12']]},
  {day:'周二',short:'胸 + 三头',english:'PUSH DAY',title:'胸部 + 肱三头肌',muscles:'胸大肌、肱三头肌、前三角肌',symbol:'↗',note:'推胸过程中肩胛保持自然稳定，不需要刻意把肩膀死死压低。',exercises:[['哑铃卧推',3,'8–12'],['上斜器械推胸',3,'10–12'],['绳索夹胸',2,'12–15'],['绳索三头下压',3,'12'],['绳索过顶臂屈伸',2,'12']]},
  {day:'周三',short:'臀 + 腿',english:'LOWER BODY',title:'臀部 + 腿部',muscles:'臀大肌、臀中肌、股四头肌、腘绳肌',symbol:'↑',note:'深蹲注意脚掌稳定，臀推顶峰时避免过度挺腰。',exercises:[['自由深蹲或史密斯深蹲',3,'8–10'],['臀推',3,'10–12'],['罗马尼亚硬拉',3,'10'],['坐姿髋外展',2,'15'],['坐姿腿弯举',2,'12']]},
  {day:'周四',short:'肩 + 核心',english:'SHOULDERS & CORE',title:'肩部 + 核心',muscles:'三角肌前束、中束、后束及核心肌群',symbol:'✳',note:'侧平举不要耸肩借力，重量以能控制住动作为准。',exercises:[['哑铃肩推',3,'8–10'],['哑铃侧平举',3,'12–15'],['反向蝴蝶机飞鸟',3,'12–15'],['俯卧 Y 举',2,'12'],['死虫式',2,'每侧 10'],['Pallof Press 抗旋转',2,'每侧 10']]},
  {day:'周五',short:'全身补充',english:'FULL BODY',title:'全身补充 + 弱项强化',muscles:'背部、胸部、臀腿、核心',symbol:'ϟ',note:'这一天以中等重量为主，不需要每组练到力竭。',exercises:[['高位下拉',2,'12'],['器械推胸',2,'12'],['腿举',3,'12'],['绳索臀后踢',2,'每侧 12'],['农夫行走',3,'30 秒'],['平板支撑',2,'30–45 秒']]},
  ...['周六','周日'].map(day=>({day,short:'主动恢复',english:'REST & RECOVER',title:'今天，给恢复留一点空间。',muscles:'散步 · 瑜伽 · 轻度有氧，或好好休息',symbol:'⌁',note:'休息也是训练的一部分。按自己的状态安排轻度活动，让身体准备好下一次出发。',exercises:[]}))
];

const PREVIOUS_PLAN_VERSION = 'original-v1';
PREVIOUS_TRAINING_PLAN.forEach(plan=>{plan.version=PREVIOUS_PLAN_VERSION;});
const PLAN_VERSION = 'balanced-8-week-v1';
const move=(name,count,target,id,rest=90,extra={})=>[name,count,target,id,{rest,kind:'strength',unit:'次',...extra}];
const TRAINING_PLAN = [
 {day:'周一',short:'上肢 A',english:'UPPER A',title:'上肢 A · 推拉与三头',muscles:'背部、胸部、三角肌、肱三头肌',symbol:'↗',note:'划船允许肩胛自然前伸、后收；推的动作先轻重量试做。减重或缩小幅度后仍有肩痛，就跳过该动作。',warmup:'轻松走路 3 分钟；轻柔抬臂、肩胛活动；前两个动作各做 1–2 组逐渐加重的热身组，均不练到疲劳。',exercises:[
 move('胸托哑铃划船',3,'10–12','ex-0327',120),move('中立握哑铃地板卧推',3,'10–12','supp-floor-press',120,{tip:'不保证换握法就无痛；关节痛时停止，不反复试疼痛重量。'}),move('中立握高位下拉',2,'10–12','ex-0818',90),move('哑铃侧平举',2,'12–15','ex-0334',60,{tip:'手臂可略朝前，在舒适范围内抬起，不追求高度。'}),move('绳索三头下压',3,'10–15','ex-0200',60)
 ]},
 {day:'周二',short:'下肢 A',english:'LOWER A',title:'下肢 A · 深蹲与髋主导',muscles:'臀肌、股四头肌、腘绳肌、小腿',symbol:'↑',note:'深蹲以膝部舒适、可控、次日无加重为准，不强求深度。重新选择负荷，不照搬旧训练重量。',warmup:'轻松单车或平地走 3 分钟；脚掌三点支撑、徒手髋铰链和舒适幅度深蹲；前两个动作各做 1–2 组热身组。',exercises:[
 move('高脚杯深蹲',3,'8–10','ex-1760',120,{alternatives:['ex-0043'],tip:'可选熟悉的杠铃深蹲；脚跟、大脚趾根和小脚趾根自然接触地面。'}),move('罗马尼亚硬拉',3,'8–12','ex-0085',120),move('坐姿腿弯举',2,'10–15','ex-0599',90),move('坐姿髋外展',2,'12–15','ex-0597',60),move('扶支撑双脚提踵',2,'12–15','ex-1373',60)
 ]},
 {day:'周三',short:'控制 + 有氧',english:'CONTROL & RECOVER',title:'低强度有氧 · 肩胛与足踝控制',muscles:'轻松有氧、肩胛控制、核心与足踝',symbol:'⌁',kind:'control',note:'这是低强度练习日，不追求酸胀或力竭。足部练习以功能和舒适为目标；任何练习引起关节痛就停止。',warmup:'轻松走动 3–5 分钟。单车保持能完整说话的强度；控制练习用轻负荷，转换动作时自然休息。',exercises:[
 move('固定单车',1,'20–25 分钟','ex-0798',0,{kind:'cardio',unit:'分钟',tip:'可换平地走路；把实际完成的分钟数填入时长栏。',alternatives:['supp-flat-walk']}),move('前臂靠墙滑动',2,'8','supp-wall-slide',45,{kind:'control'}),move('墙面俯卧撑加肩胛前伸',2,'8–10','supp-wall-plus',45,{kind:'control'}),move('弹力带肩外旋（肘靠体侧）',2,'每侧 12–15','supp-band-external',45,{kind:'control'}),move('死虫式',2,'每侧 6–8','ex-0276',45,{kind:'control'}),move('轻阻力 Pallof 抗旋转推',2,'每侧 8–10','ex-0979',45,{kind:'control'}),move('坐姿短足练习',1,'6–8 次 · 每次保持 5 秒','supp-short-foot',30,{kind:'control',tip:'不蜷脚趾，不把脚翻向外侧；足部控制合计约 5 分钟。'}),move('扶支撑单脚站立',2,'每侧 20–30 秒','supp-balance',30,{kind:'control',unit:'秒'})
 ]},
 {day:'周四',short:'上肢 B',english:'UPPER B',title:'上肢 B · 背部与肩臂',muscles:'背部、胸部、肩部、肱三头肌、肱二头肌',symbol:'↙',note:'单臂动作从右侧开始，左右相同次数和组数，不额外加练一侧。用高台高度调整俯卧撑难度，保持肩部无痛。',warmup:'轻松走路 3 分钟；轻柔肩胛活动；下拉或辅助引体、划船各做 1–2 组热身组，不提前消耗体力。',exercises:[
 move('高位下拉 / 辅助引体',2,'8–10','ex-0818',120,{alternatives:['ex-0017'],tip:'二选一，不叠加；辅助量以仍保留规范动作余力为准。'}),move('单臂绳索划船',3,'每侧 10–12','ex-0189',90,{tip:'采用库中的单臂俯身变式；躯干稳定，不旋转甩动。'}),move('上斜俯卧撑',2,'10–15','ex-0493',90),move('哑铃侧平举',2,'12–15','ex-0334',60),move('绳索三头下压',3,'10–15','ex-0200',60),move('哑铃弯举',2,'10–15','ex-0294',60)
 ]},
 {day:'周五',short:'下肢 B',english:'LOWER B',title:'下肢 B · 臀腿与周末恢复',muscles:'臀肌、腿部、小腿',symbol:'ϟ',note:'周末打球时，本日先不加重量或组数。训练后膝部发胀或不适，就暂停周末打球并观察；反复肿胀应评估。',warmup:'轻松单车或平地走 3 分钟；徒手臀桥与髋铰链；臀推、腿举各做 1–2 组轻负荷热身。',exercises:[
 move('臀推',3,'10–12','supp-hip-thrust',120,{alternatives:['ex-3013'],tip:'肩靠凳不适可换地面臀桥；顶部不靠过度挺腰完成。'}),move('腿举',2,'10–12','ex-0739',120,{tip:'下放到骨盆稳定、膝部舒适的位置，不强求深度。'}),move('坐姿腿弯举',2,'10–15','ex-0599',90),move('坐姿髋外展',2,'12–15','ex-0597',60),move('扶支撑双脚提踵',2,'12–15','ex-1373',60)
 ]},
 ...['周六','周日'].map(day=>({day,short:'主动恢复',english:'REST & RECOVER',title:'给恢复，也留一点空间。',muscles:'舒适的散步、日常活动或休息',symbol:'⌁',kind:'rest',note:'根据恢复情况安排活动。打球前后留意膝部反应；保护带不能作为忍痛继续运动的依据。',exercises:[]}))
].map(plan=>({...plan,version:PLAN_VERSION,flow:plan.kind==='control'?[['热身','5 分钟'],['有氧','20–25 分钟'],['控制与整理','25–30 分钟']]:[['热身','8–10 分钟'],['力量','40–45 分钟'],['有氧 / 整理','5–10 分钟']]}));
