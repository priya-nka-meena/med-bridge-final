const schemes   = require('../data/schemes');
const hospitals = require('../data/hospitals');

/**
 * Match schemes based on detected conditions, state, BPL, income, and age
 */
function matchSchemes({ conditions = [], state = 'Delhi', bpl = false, income, age }) {
  const primaryCondition = conditions[0] || 'general';
  const allConditions = conditions.length > 0 ? [...conditions, 'general'] : ['general'];

  const scored = schemes.map(scheme => {
    let score = 0;

    // Condition match scoring
    const schemeConditions = scheme.conditions || [];
    for (const c of allConditions) {
      const idx = schemeConditions.indexOf(c);
      if (idx !== -1) {
        // Higher score for primary condition match
        score += c === primaryCondition ? 10 : (conditions.includes(c) ? 6 : 2);
      }
    }

    // No match at all — skip
    if (score === 0) return null;

    // State match bonus
    if (scheme.states.includes('all') || scheme.states.includes(state)) {
      score += 3;
    } else {
      return null; // State-specific scheme doesn't match
    }

    // BPL boost
    if (bpl && scheme.bpl_required) score += 4;
    if (!scheme.bpl_required) score += 1; // Universal schemes get small boost

    // Income eligibility filter
    if (scheme.income_limit && income && income > scheme.income_limit) {
      return null; // Over income limit
    }
    if (!scheme.income_limit) score += 1; // No income limit = more accessible

    // Age eligibility filter
    if (age !== undefined && age !== null) {
      const ageNum = parseInt(age);
      if (!isNaN(ageNum)) {
        if (ageNum < (scheme.age_min || 0) || ageNum > (scheme.age_max || 120)) {
          return null; // Age out of range
        }
        // Bonus for age-specific schemes that match
        if (scheme.age_min > 0 || scheme.age_max < 120) score += 2;
      }
    }

    return { ...scheme, _score: score, matched_condition: primaryCondition };
  }).filter(Boolean);

  // Sort by score descending
  return scored.sort((a, b) => b._score - a._score);
}

/**
 * Match hospitals by conditions and state
 */
function matchHospitals({ conditions = [], state = 'Delhi' }) {
  const allConditions = conditions.length > 0 ? [...conditions, 'general'] : ['general'];

  return hospitals
    .filter(h => {
      // State match
      if (h.state !== state) return false;
      // Condition match — hospital must handle at least one condition
      if (!h.speciality || h.speciality.length === 0) return true;
      return allConditions.some(c => h.speciality.includes(c));
    })
    .map(h => {
      // Score: more matching specialities = higher priority
      const matchCount = allConditions.filter(c => (h.speciality || []).includes(c)).length;
      return { ...h, _matchCount: matchCount };
    })
    .sort((a, b) => b._matchCount - a._matchCount);
}

module.exports = { matchSchemes, matchHospitals };
