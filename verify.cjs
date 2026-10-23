const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const storage = new Map();
const context = {localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}, document:{addEventListener:()=>{},querySelector:()=>({textContent:'',style:{}})}};
vm.createContext(context);
for(const file of ['plan.js','dataset.js','legacy-data.js','library.js','illustrations.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
vm.runInContext(fs.readFileSync('app.js','utf8').split("$('#days').addEventListener")[0],context);
function run(code){return vm.runInContext(code,context);}
run('renderWeek = () => {}; renderWorkout = () => {};');
assert.strictEqual(run('EXERCISE_LIBRARY.length'),1324);
assert.strictEqual(run('new Set(EXERCISE_LIBRARY.map(e=>e.id)).size'),1324);
assert.strictEqual(run('TRAINING_PLAN.every(plan=>plan.exercises.every(([name])=>EXERCISE_BY_NAME[name]))'),true);
assert.strictEqual(run('EXERCISE_LIBRARY.every(exercise=>exercise.cues.length>0 && exercise.setup && exercise.source.startsWith("https://"))'),true);
const illustrations=run('LEGACY_EXERCISES.map(exercise=>({name:exercise.name,svg:LegacyExerciseArt.guide(exercise)}))');
assert(illustrations.every(item=>!item.svg.includes('NaN')&&!item.svg.includes('undefined')));
// A v1 journal continues to mean the original movements after recurring choices change.
assert.strictEqual(run(`(()=>{selectedDate=dateFromKey('2026-10-19'); const legacy={note:'old',exercises:getPlan().exercises.map(([,count])=>emptySets(count))}; legacy.exercises[0][0]={weight:'20',reps:'12',done:true};journal={'2026-10-19':legacy};planChoices={0:['single-row',...originalExerciseIds(getPlan()).slice(1)]};return isValidJournal(journal)&&getSession().exerciseIds[0]==='neutral-pulldown';})()`),true);
// Switching back restores the original recorded sets; a new exercise starts blank.
assert.strictEqual(run(`(()=>{replaceExercise(0,'single-row',false);const clean=getSession().exercises[0].every(set=>!set.done&&!set.weight);replaceExercise(0,'neutral-pulldown',false);return clean&&getSession().exercises[0][0].weight==='20'&&getSession().exercises[0][0].done;})()`),true);
// Remembered choices apply to new sessions, without renaming past records.
assert.strictEqual(run(`(()=>{replaceExercise(0,'single-row',true);selectedDate=dateFromKey('2026-10-26');const future=getSession().exerciseIds[0]==='ex-0292';selectedDate=dateFromKey('2026-10-19');return future&&getSession().exercises[0].length===3&&isValidJournal(journal)&&isValidPlanChoices(planChoices);})()`),true);
assert.strictEqual(run(`isValidJournal({'2026-02-30':getSession()})`),false);
assert.strictEqual(run(`isValidExerciseIds(['not-real'],1)`),false);
assert.strictEqual(run(`isValidPlanChoices({5:[]})`),false);
assert.strictEqual(run(`isValidJournal({'2026-10-19':{...getSession(),alternatives:{'999:plank':[]}}})`),false);
// Pagination reaches every source ID exactly once, including the final record.
assert.strictEqual(run(`(()=>{const ids=[];for(let page=1;page<=28;page++)ids.push(...exercisePage(EXERCISE_LIBRARY,page).items.map(e=>e.datasetId));return ids.length===1324&&new Set(ids).size===1324&&ids[1323]===DATASET_EXERCISES[1323].id;})()`),true);
assert.strictEqual(run(`Object.keys(EXERCISE_GROUPS).reduce((total,group)=>total+filterExercises({group}).length,0)`),1324);
assert.strictEqual(run(`EXERCISE_LIBRARY.every(e=>e.instruction_steps.zh.length===e.instruction_steps.en.length&&e.imageUrl.endsWith(e.image)&&e.gifUrl.endsWith(e.gif_url))`),true);
assert.strictEqual(run(`filterExercises({equipment:'dumbbell',target:'biceps',query:'弯曲'}).every(e=>e.equipmentKey==='dumbbell'&&e.target==='biceps')`),true);
assert.strictEqual(run(`filterExercises({query:DATASET_EXERCISES[1323].id}).some(e=>e.datasetId===DATASET_EXERCISES[1323].id)`),true);
// Replacing a legacy movement with a dataset movement must start with empty sets.
assert.strictEqual(run(`(()=>{selectedDate=dateFromKey('2026-10-19');replaceExercise(0,'ex-0818',false);const clean=getSession().exercises[0].every(s=>!s.done&&!s.weight);replaceExercise(0,'neutral-pulldown',false);return clean&&getSession().exercises[0][0].weight==='20';})()`),true);
console.log('PASS: all 1,324 IDs/instructions/media paths/pages; 10 categories; 38 legacy diagrams; old/new records and restore; recurring choices; import validation.');
