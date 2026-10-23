'use strict';
const DATASET_REPOSITORY = 'https://github.com/RoiSoleil520/exercises-dataset';
const DATASET_MEDIA_BASE = `https://cdn.jsdelivr.net/gh/RoiSoleil520/exercises-dataset@${DATASET_REVISION}/`;
const EXERCISE_GROUPS = {back:'背部',chest:'胸部',shoulders:'肩部','upper arms':'上臂','lower arms':'前臂','upper legs':'臀腿','lower legs':'小腿',waist:'腰腹',cardio:'有氧',neck:'颈部'};
const EQUIPMENT_LABELS = {
  assisted:'辅助器械',band:'弹力带',barbell:'杠铃','body weight':'自重','bosu ball':'波速球',cable:'绳索',dumbbell:'哑铃',
  'elliptical machine':'椭圆机','ez barbell':'曲杆杠铃',hammer:'锤子',kettlebell:'壶铃','leverage machine':'固定器械',
  'medicine ball':'药球','olympic barbell':'奥林匹克杠铃','resistance band':'阻力带',roller:'滚筒',rope:'绳子',
  'skierg machine':'滑雪机','sled machine':'滑轨器械','smith machine':'史密斯机','stability ball':'健身球',
  'stationary bike':'固定单车','stepmill machine':'台阶机',tire:'轮胎','trap bar':'六角杠铃','upper body ergometer':'上肢功率车',weighted:'负重','wheel roller':'健腹轮'
};
const MUSCLE_LABELS = {
  abductors:'髋外展肌',abs:'腹肌',adductors:'髋内收肌',biceps:'肱二头肌',calves:'小腿肌群','cardiovascular system':'心肺系统',
  delts:'三角肌',forearms:'前臂肌群',glutes:'臀肌',hamstrings:'腘绳肌',lats:'背阔肌','levator scapulae':'肩胛提肌',
  pectorals:'胸肌',quads:'股四头肌','serratus anterior':'前锯肌',spine:'脊柱竖肌',traps:'斜方肌',triceps:'肱三头肌',
  'upper back':'上背部','hip flexors':'髋屈肌','lower back':'下背部',shoulders:'肩部',core:'核心肌群',quadriceps:'股四头肌','rotator cuff':'肩袖肌群'
};
// Select actual dataset variants for new sessions. Saved legacy sets keep their original exercise IDs.
const LEGACY_TO_DATASET = {
  'neutral-pulldown':'0818','chest-supported-row':'0327','cable-row':'0180','face-pull':'0233','dumbbell-curl':'0294',
  'dumbbell-bench':'0289','incline-machine':'1299','cable-fly':'0227','triceps-pushdown':'0200','cable-overhead':'0194',
  squat:'0043','hip-thrust':'3523',rdl:'0085','hip-abduction':'0597','leg-curl':'0599','shoulder-press':'0405',
  'lateral-raise':'0334','reverse-fly':'0602','prone-y':'3541','dead-bug':'0276',pallof:'0979','lat-pulldown':'0198',
  'chest-press':'0577','leg-press':'0739','glute-kickback':'0228','farmer-walk':'2133',plank:'2135','single-row':'0292',
  'push-up':'0662','incline-dumbbell':'0314','hammer-curl':'0313','cable-curl':'0868','dumbbell-overhead':'2188',
  'goblet-squat':'1760','split-squat':'0410','glute-bridge':'3013','bird-dog':'3239','side-plank':'0705'
};
const DATASET_CHINESE_NAMES = {
  '0818':'双手柄对握高位下拉','0327':'上斜凳胸托哑铃划船','0180':'低位坐姿绳索划船','0233':'站姿绳索后三角划船',
  '0294':'哑铃弯举','0289':'哑铃卧推','1299':'上斜器械推胸','0227':'站姿绳索飞鸟','0200':'绳索三头下压','0194':'绳索过顶臂屈伸',
  '0043':'杠铃全蹲','3523':'凳上双腿臀桥','0085':'杠铃罗马尼亚硬拉','0597':'坐姿器械髋外展','0599':'坐姿腿弯举',
  '0405':'坐姿哑铃肩推','0334':'哑铃侧平举','0602':'坐姿器械反向飞鸟','3541':'上斜凳哑铃 Y 举','0276':'死虫式',
  '0979':'弹力带水平 Pallof 抗旋转推','0198':'绳索高位下拉','0577':'器械推胸','0739':'45° 腿举','0228':'站姿绳索髋后伸',
  '2133':'农夫行走','2135':'负重前平板支撑','0292':'单臂哑铃划船','0662':'俯卧撑','0314':'上斜哑铃卧推','0313':'哑铃锤式弯举',
  '0868':'绳索弯举','2188':'坐姿哑铃臂屈伸','1760':'哑铃高脚杯深蹲','0410':'哑铃单腿分腿蹲','3013':'低位徒手臀桥',
  '3239':'跪姿平板交替触肩','0705':'侧桥支撑','0001':'3/4 仰卧起坐','0025':'杠铃卧推'
};
const muscleLabel = value => MUSCLE_LABELS[value] || value;
const EXERCISE_LIBRARY = DATASET_EXERCISES.map(record => ({
  ...record,id:`ex-${record.id}`,datasetId:record.id,name:DATASET_CHINESE_NAMES[record.id] || record.name,
  englishName:record.name,groups:[record.category],equipmentKey:record.equipment,equipment:EQUIPMENT_LABELS[record.equipment] || record.equipment,
  muscles:muscleLabel(record.target),secondaryMuscles:record.secondary_muscles.map(muscleLabel).join('、'),setup:record.instruction_steps.zh[0],cues:record.instruction_steps.zh,
  source:`${DATASET_REPOSITORY}/blob/${DATASET_REVISION}/data/exercises.json`,imageUrl:DATASET_MEDIA_BASE+record.image,gifUrl:DATASET_MEDIA_BASE+record.gif_url
}));
const EXERCISE_BY_ID = Object.fromEntries([
  ...LEGACY_EXERCISES.map(exercise => [exercise.id,{...exercise,legacy:true}]),...EXERCISE_LIBRARY.map(exercise => [exercise.id,exercise])
]);
const EXERCISE_BY_NAME = Object.fromEntries(LEGACY_EXERCISES.map(exercise => [exercise.name,EXERCISE_BY_ID[`ex-${LEGACY_TO_DATASET[exercise.id]}`]]));
function originalExerciseIds(plan) { return plan.exercises.map(([name])=>EXERCISE_BY_NAME[name].id); }
function legacyExerciseIds(plan) { return plan.exercises.map(([name])=>LEGACY_EXERCISES.find(exercise=>exercise.name===name).id); }
function exerciseGroupLabel(exercise) { return exercise.groups.map(group=>EXERCISE_GROUPS[group] || LEGACY_EXERCISE_GROUPS[group]).join(' / '); }
function filterExercises({group='all',equipment='all',target='all',query=''}={}) {
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return EXERCISE_LIBRARY.filter(exercise => (group==='all'||exercise.groups.includes(group)) &&
    (equipment==='all'||exercise.equipmentKey===equipment) && (target==='all'||exercise.target===target) &&
    words.every(word=>`${exercise.datasetId} ${exercise.name} ${exercise.englishName} ${exercise.muscles} ${exercise.secondaryMuscles} ${exercise.equipment} ${exercise.equipmentKey} ${exerciseGroupLabel(exercise)} ${exercise.cues.join(' ')}`.toLowerCase().includes(word)));
}
function exercisePage(exercises,page,size=48) {
  const pages=Math.max(1,Math.ceil(exercises.length/size));
  const current=Math.min(Math.max(1,page),pages);
  return {items:exercises.slice((current-1)*size,current*size),current,pages,total:exercises.length};
}
