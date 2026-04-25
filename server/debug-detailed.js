const { matchSchemes } = require('./utils/matcher');

async function debugSearch() {
  try {
    const query = 'diabetes';
    const state = 'Delhi';
    const bpl = false;
    const income = undefined;
    
    // Simulate the server's detectConditions function
    const conditions = ['diabetes']; // Simulate detected conditions
    
    console.log('=== DEBUGGING MATCHSCHEMES ===');
    console.log('Input conditions:', conditions);
    console.log('Input state:', state);
    console.log('Input bpl:', bpl);
    console.log('Input income:', income);
    
    console.log('\n=== CALLING MATCHSCHEMES ===');
    const result = matchSchemes({ conditions, state, bpl, income });
    console.log('Result length:', result.length);
    console.log('First result:', result[0]);
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('STACK:', error.stack);
  }
}

debugSearch();
