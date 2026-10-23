// Usage: node scripts/import-dataset.cjs /path/to/exercises-dataset
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const source = process.argv[2];
if (!source) throw new Error('Provide the path to the forked exercises-dataset repository.');
const records = JSON.parse(fs.readFileSync(path.join(source, 'data/exercises.json'), 'utf8'));
if (records.length !== 1324 || new Set(records.map(item => item.id)).size !== 1324) {
  throw new Error('Expected 1,324 unique exercises; review upstream changes before updating.');
}
const revision = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const fields = ['id','name','category','body_part','equipment','target','muscle_group','secondary_muscles','image','gif_url','attribution'];
const exercises = records.map(record => {
  const exercise = Object.fromEntries(fields.map(field => [field, record[field]]));
  exercise.instruction_steps = Object.fromEntries(['zh','en'].map(language => {
    const steps = record.instruction_steps[language];
    if (!steps?.length || steps.some(step => typeof step !== 'string' || !step.trim())) {
      throw new Error(`Missing ${language} instructions for ${record.id}`);
    }
    return [language, steps];
  }));
  return exercise;
});
fs.writeFileSync('dataset.js', `// Generated from RoiSoleil520/exercises-dataset; see DATASET-LICENSE.txt.\nconst DATASET_REVISION = ${JSON.stringify(revision)};\nconst DATASET_EXERCISES = ${JSON.stringify(exercises)};\n`);
console.log(`Imported ${exercises.length} exercises from ${revision}.`);
