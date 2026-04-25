const schemes = require('./data/schemes');
const { detectConditions } = require('./utils/matcher');

console.log('Testing condition detection...');
const conditions = detectConditions('diabetes');
console.log('Detected conditions:', conditions);

console.log('\nChecking first scheme...');
const firstScheme = schemes[0];
console.log('First scheme:', firstScheme);
console.log('First scheme condition:', firstScheme.condition);
console.log('Condition includes diabetes:', firstScheme.condition.includes('diabetes'));

console.log('\nTesting condition mapping...');
const mappedConditions = conditions.map(cond => {
  const conditionMap = {
    'diabetes': 'diabetes',
    'kidney': 'kidney_disease',
    'dialysis': 'kidney_disease',
    'cancer': 'cancer',
    'heart': 'heart_disease',
    'cardiac': 'heart_disease',
    'tb': 'tuberculosis',
    'pregnancy': 'maternity',
    'maternity': 'maternity',
    'child': 'child_health',
    'mental': 'mental_health',
    'eye': 'eye_disease',
    'trauma': 'trauma'
  };
  return conditionMap[cond] || cond;
});
console.log('Mapped conditions:', mappedConditions);
