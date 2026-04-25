const schemes = require('./data/schemes');
const { detectConditions } = require('./utils/matcher');

console.log('Testing state matching logic...');
const firstScheme = schemes[0];
console.log('Scheme states:', firstScheme.states);
console.log('State includes Delhi:', firstScheme.states.includes('Delhi'));
console.log('State includes all:', firstScheme.states.includes('all'));

console.log('\nTesting the actual condition...');
const conditions = detectConditions('diabetes');
console.log('Conditions:', conditions);
console.log('Conditions length > 0:', conditions.length > 0);

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
console.log('Some condition matches:', mappedConditions.some(cond => firstScheme.condition && firstScheme.condition.includes(cond)));

console.log('\nTesting state logic...');
console.log('scheme.states:', firstScheme.states);
console.log('scheme.states.includes(state):', firstScheme.states.includes('Delhi'));
console.log('Should pass if states includes "all":', firstScheme.states.includes('all') || firstScheme.states.includes('Delhi'));
