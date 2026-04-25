// Test the regex detection function
const CONDITION_REGEX = {
  kidney_disease: /kidney|dialysis|renal|hemodialysis|nephro/i,
  cancer:         /cancer|tumor|oncology|chemotherapy|carcinoma/i,
  heart_disease:  /heart|cardiac|bypass|angioplasty|cardio/i,
  diabetes:       /diabetes|diabetic|insulin|blood sugar|glucose/i,
  hypertension:   /hypertension|bp|blood pressure|high blood/i,
  tuberculosis:   /tb|tuberculosis|cough|sputum|pulmonary/i,
  maternity:      /pregnant|pregnancy|delivery|prenatal|labour|जननी/i,
  child_health:   /child|infant|baby|vaccination|immunization|pediatric/i,
  mental_health:  /depression|anxiety|mental|psychiatric|stress/i,
  eye_disease:    /eye|cataract|glaucoma|vision|blindness/i,
  trauma:         /accident|injury|fracture|trauma|emergency/i,
};

function regexDetect(query) {
  return Object.entries(CONDITION_REGEX)
    .filter(([, rx]) => rx.test(query))
    .map(([cond]) => cond);
}

console.log('Testing regex detection...');
const query = 'diabetes';
console.log('Query:', query);
const result = regexDetect(query);
console.log('Result:', result);
console.log('Result type:', typeof result);
console.log('Is array:', Array.isArray(result));
