from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import re

for pkg in ['punkt', 'stopwords', 'wordnet', 'punkt_tab']:
    try:
        nltk.data.find(f'tokenizers/{pkg}' if 'punkt' in pkg else f'corpora/{pkg}')
    except LookupError:
        nltk.download(pkg, quiet=True)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
CORS(app)

lemmatizer = WordNetLemmatizer()
STOP_WORDS = set(stopwords.words('english'))

CONDITION_KEYWORDS = {
    "kidney_disease": {
        "phrases": ["kidney disease", "kidney failure", "renal failure", "chronic kidney", "end stage renal", "kidney dialysis", "किडनी फेलियर", "गुर्दे की बीमारी"],
        "words": ["kidney", "renal", "dialysis", "nephrology", "creatinine", "nephrotic", "hemodialysis", "peritoneal", "transplant", "uremia", "गुर्दा", "किडनी", "डायलिसिस"],
        "partial": ["nephro", "renal", "dialys"]
    },
    "cancer": {
        "phrases": ["breast cancer", "cervical cancer", "lung cancer", "oral cancer", "blood cancer", "cancer treatment"],
        "words": ["cancer", "tumor", "tumour", "oncology", "chemotherapy", "radiation", "biopsy", "malignant", "carcinoma", "lymphoma", "leukemia", "कैंसर", "ट्यूमर"],
        "partial": ["carcin", "onco", "chemo"]
    },
    "heart_disease": {
        "phrases": ["heart attack", "heart failure", "heart disease", "bypass surgery", "heart block", "दिल का दौरा"],
        "words": ["heart", "cardiac", "cardiology", "bypass", "angioplasty", "infarction", "artery", "valve", "pacemaker", "echocardiogram", "angina", "दिल", "हृदय", "हार्ट"],
        "partial": ["cardio", "cardiac", "angio"]
    },
    "diabetes": {
        "phrases": ["blood sugar", "type 2 diabetes", "type 1 diabetes", "sugar control", "insulin dependent", "ब्लड शुगर"],
        "words": ["diabetes", "diabetic", "insulin", "glucose", "hba1c", "metformin", "hyperglycemia", "मधुमेह", "शुगर", "डायबिटीज"],
        "partial": ["diabet", "glyc"]
    },
    "tuberculosis": {
        "phrases": ["chest infection", "lung infection", "blood in cough", "खांसी में खून"],
        "words": ["tb", "tuberculosis", "cough", "sputum", "pulmonary", "dots", "rifampicin", "isoniazid", "क्षयरोग", "टीबी", "खांसी"],
        "partial": ["tuberc", "sputum"]
    },
    "maternity": {
        "phrases": ["pregnant woman", "free delivery", "normal delivery", "cesarean section", "prenatal care", "गर्भवती महिला", "मुफ्त प्रसव"],
        "words": ["pregnant", "pregnancy", "delivery", "prenatal", "antenatal", "postnatal", "maternity", "childbirth", "labour", "labor", "newborn", "जननी", "गर्भवती", "प्रसव", "डिलीवरी"],
        "partial": ["pregnan", "matern", "natal"]
    },
    "child_health": {
        "phrases": ["child vaccination", "baby health", "infant care", "newborn care", "बच्चे का टीकाकरण"],
        "words": ["child", "infant", "baby", "vaccination", "immunization", "pediatric", "paediatric", "newborn", "toddler", "बच्चा", "शिशु", "टीकाकरण"],
        "partial": ["vaccin", "immun", "pediatr"]
    },
    "mental_health": {
        "phrases": ["mental health", "feeling depressed", "anxiety disorder", "mental illness", "मानसिक बीमारी"],
        "words": ["depression", "anxiety", "mental", "psychiatric", "psychiatry", "stress", "trauma", "bipolar", "schizophrenia", "counselling", "therapy", "अवसाद", "मानसिक", "तनाव"],
        "partial": ["depress", "anxiet", "psychi"]
    },
    "eye_disease": {
        "phrases": ["cataract surgery", "eye problem", "vision loss", "आंख की बीमारी", "मोतियाबिंद"],
        "words": ["eye", "vision", "cataract", "glaucoma", "retina", "blindness", "ophthalmology", "cornea", "आँख", "दृष्टि", "मोतियाबिंद"],
        "partial": ["ophthalm", "cataract", "retin"]
    },
    "trauma": {
        "phrases": ["road accident", "bone fracture", "head injury", "dड़ुर्घटना"],
        "words": ["accident", "injury", "fracture", "trauma", "emergency", "surgery", "operation", "wound", "burn", "दुर्घटना", "चोट", "फ्रैक्चर"],
        "partial": ["fractur", "traum", "injur"]
    },
}

def detect_conditions(text: str) -> dict:
    text_lower = text.lower()
    try:
        tokens = word_tokenize(text_lower)
        lemmatized = [lemmatizer.lemmatize(t) for t in tokens if t.isalpha() and t not in STOP_WORDS]
    except Exception:
        lemmatized = text_lower.split()

    scores = {}
    matched_keywords_map = {}

    for condition, kw_groups in CONDITION_KEYWORDS.items():
        score = 0
        matched = []

        for phrase in kw_groups.get("phrases", []):
            if phrase.lower() in text_lower:
                score += 4
                matched.append(phrase)

        for word in kw_groups.get("words", []):
            if word.lower() in lemmatized:
                score += 2
                matched.append(word)
            elif word.lower() in text_lower:
                score += 1
                matched.append(word)

        for partial in kw_groups.get("partial", []):
            if any(partial.lower() in token for token in lemmatized):
                score += 1

        if score > 0:
            scores[condition] = score
            matched_keywords_map[condition] = matched

    sorted_conditions = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return {
        "conditions": [c for c, _ in sorted_conditions],
        "scores": scores,
        "matched_keywords": matched_keywords_map,
        "primary": sorted_conditions[0][0] if sorted_conditions else "general"
    }

@app.route('/nlp/detect', methods=['POST'])
def detect():
    body = request.get_json(silent=True) or {}
    text = body.get('text', '').strip()
    if not text:
        return jsonify({"error": "text field required"}), 400
    result = detect_conditions(text)
    return jsonify(result)

@app.route('/nlp/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "MedBridge NLP v2"})

if __name__ == '__main__':
    app.run(port=5001, debug=False)
