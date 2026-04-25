
function matchSchemes({ conditions, state, bpl, income }) {
  const schemes = require('../data/schemes');
  
  // Ensure conditions is an array
  if (!conditions || !Array.isArray(conditions)) {
    conditions = [];
  }
  
  // Map conditions to match data format
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
  
  return schemes.filter(scheme => {
    console.log('[MATCHER DEBUG] Processing scheme:', scheme.id);
    console.log('[MATCHER DEBUG] scheme.condition:', scheme.condition);
    console.log('[MATCHER DEBUG] mappedConditions:', mappedConditions);
    
    // Check condition match
    if (mappedConditions.length > 0) {
      if (!scheme.condition || !Array.isArray(scheme.condition)) {
        console.log('[MATCHER DEBUG] No condition array, returning false');
        return false;
      }
      const hasMatchingCondition = mappedConditions.some(cond => 
        scheme.condition.includes(cond)
      );
      console.log('[MATCHER DEBUG] hasMatchingCondition:', hasMatchingCondition);
      if (!hasMatchingCondition) {
        return false;
      }
    }
    
    // Check state match
    if (scheme.states && Array.isArray(scheme.states)) {
      if (!scheme.states.includes('all') && !scheme.states.includes(state)) {
        return false;
      }
    }
    
    // Check BPL requirement
    if (scheme.bpl_required && !bpl) {
      return false;
    }
    
    // Check income limit
    if (scheme.income_limit && income && income > scheme.income_limit) {
      return false;
    }
    
    return true;
  });
}

function matchHospitals({ conditions, state }) {
  const hospitals = require('../data/hospitals');
  
  // Ensure conditions is an array
  if (!conditions || !Array.isArray(conditions)) {
    conditions = [];
  }
  
  // Map conditions to match data format
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
  
  return hospitals.filter(hospital => {
    // Check state match
    if (hospital.state !== state) {
      return false;
    }
    
    // Check condition match
    if (mappedConditions.length > 0) {
      if (!hospital.speciality || !Array.isArray(hospital.speciality)) {
        return false;
      }
      const hasMatchingCondition = mappedConditions.some(cond => 
        hospital.speciality.includes(cond)
      );
      if (!hasMatchingCondition) {
        return false;
      }
    }
    
    return true;
  });
}

module.exports = { matchSchemes, matchHospitals };
