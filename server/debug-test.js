const { detectConditions, matchSchemes, matchHospitals } = require('./utils/matcher');

console.log('Testing condition detection...');
const conditions = detectConditions('diabetes');
console.log('Detected conditions:', conditions);

console.log('\nTesting scheme matching...');
const result = matchSchemes({ conditions, state: 'Delhi', bpl: false, income: 250000 });
console.log('Matched schemes count:', result.length);
console.log('First scheme:', result[0]);
