const { detectConditions, matchSchemes } = require('./utils/matcher');

async function testSearch() {
  try {
    const query = 'diabetes';
    const state = 'Delhi';
    const bpl = false;
    const income = undefined;
    
    console.log('Testing detectConditions...');
    const conditions = await detectConditions(query);
    console.log('Conditions:', conditions);
    console.log('Conditions type:', typeof conditions);
    console.log('Conditions is array:', Array.isArray(conditions));
    
    console.log('\nTesting matchSchemes...');
    console.log('Calling matchSchemes with:', { conditions, state, bpl, income });
    
    const result = matchSchemes({ conditions, state, bpl, income });
    console.log('Result:', result);
    console.log('Result length:', result.length);
    
  } catch (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }
}

testSearch();
