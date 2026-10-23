const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const storage = new Map();
const context = {localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}, document:{querySelector:()=>({textContent:'',style:{}})}};
vm.createContext(context);
for(const file of ['plan.js','library.js','illustrations.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
vm.runInContext(fs.readFileSync('app.js','utf8').split("$('#days').addEventListener")[0],context);
function run(code){return vm.runInContext(code,context);}
run('renderWeek = () => {}; renderWorkout = () => {};');
assert.strictEqual(run('EXERCISE_LIBRARY.length'),38);
assert.strictEqual(run('new Set(EXERCISE_LIBRARY.map(e=>e.id)).size'),38);
assert.strictEqual(run('TRAINING_PLAN.every(plan=>plan.exercises.every(([name])=>EXERCISE_BY_NAME[name]))'),true);
assert.strictEqual(run('EXERCISE_LIBRARY.every(exercise=>exercise.cues.length===3 && exercise.setup && exercise.mistake && exercise.source.startsWith("https://"))'),true);
const illustrations=run('EXERCISE_LIBRARY.map(exercise=>({name:exercise.name,svg:ExerciseArt.guide(exercise)}))');
assert(illustrations.every(item=>!item.svg.includes('NaN')&&!item.svg.includes('undefined')));
// A v1 journal continues to mean the original movements after recurring choices change.
assert.strictEqual(run(`(()=>{selectedDate=dateFromKey('2026-10-19'); const legacy={note:'old',exercises:getPlan().exercises.map(([,count])=>emptySets(count))}; legacy.exercises[0][0]={weight:'20',reps:'12',done:true};journal={'2026-10-19':legacy};planChoices={0:['single-row',...originalExerciseIds(getPlan()).slice(1)]};return isValidJournal(journal)&&getSession().exerciseIds[0]==='neutral-pulldown';})()`),true);
// Switching back restores the original recorded sets; a new exercise starts blank.
assert.strictEqual(run(`(()=>{replaceExercise(0,'single-row',false);const clean=getSession().exercises[0].every(set=>!set.done&&!set.weight);replaceExercise(0,'neutral-pulldown',false);return clean&&getSession().exercises[0][0].weight==='20'&&getSession().exercises[0][0].done;})()`),true);
// Remembered choices apply to new sessions, without renaming past records.
assert.strictEqual(run(`(()=>{replaceExercise(0,'single-row',true);selectedDate=dateFromKey('2026-10-26');const future=getSession().exerciseIds[0]==='single-row';selectedDate=dateFromKey('2026-10-19');return future&&getSession().exercises[0].length===3&&isValidJournal(journal)&&isValidPlanChoices(planChoices);})()`),true);
assert.strictEqual(run(`isValidJournal({'2026-02-30':getSession()})`),false);
assert.strictEqual(run(`isValidExerciseIds(['not-real'],1)`),false);
assert.strictEqual(run(`isValidPlanChoices({5:[]})`),false);
assert.strictEqual(run(`isValidJournal({'2026-10-19':{...getSession(),alternatives:{'999:plank':[]}}})`),false);
console.log('PASS: 38 diagrams, original-plan coverage, legacy journal, replacement/restore, recurring choices, malformed import checks.');
