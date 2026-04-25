const { detectConditions } = require('./index');

async function debugServerFlow() {
  try {
    console.log('=== TESTING SERVER DETECTCONDITIONS ===');
    const query = 'diabetes';
    console.log('Query:', query);
    
    const conditions = await detectConditions(query);
    console.log('Conditions result:', conditions);
    console.log('Conditions type:', typeof conditions);
    console.log('Conditions is array:', Array.isArray(conditions));
    console.log('Conditions length:', conditions ? conditions.length : 'undefined');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('STACK:', error.stack);
  }
}

debugServerFlow();
