from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import re
import json

# Download NLTK data silently on first run
for pkg in ['punkt', 'stopwords', 'wordnet']:
    try:
        nltk.data.find(f'tokenizers/{pkg}' if pkg == 'punkt' else f'corpora/{pkg}')
    except LookupError:
        nltk.download(pkg, quiet=True)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
CORS(app)

lemmatizer = WordNetLemmatizer()
STOP_WORDS = set(stopwords.words('english'))

# ── CONDITION KEYWORD MAP ──────────────────────────────────────
CONDITION_KEYWORDS = {
    "kidney_disease": [
        "kidney", "renal", "dialysis", "nephrology", "creatinine",
        "nephrotic", "gfr", "uremia", "transplant", "hemodialysis",
        "peritoneal", "kidney failure", "kidney stone", "गुर्दा", "किडनी"
    ],
    "cancer": [
        "cancer", "tumor", "tumour", "oncology", "chemotherapy", "radiation",
        "biopsy", "malignant", "carcinoma", "lymphoma", "leukemia",
        "breast cancer", "cervical", "कैंसर", "ट्यूमर"
    ],
    "heart_disease": [
        "heart", "cardiac", "cardiology", "bypass", "angioplasty",
        "heart attack", "myocardial", "infarction", "artery", "valve",
        "pacemaker", "echocardiogram", "दिल", "हृदय"
    ],
    "diabetes": [
        "diabetes", "diabetic", "insulin", "blood sugar", "glucose",
        "hba1c", "type 2", "type 1", "hyperglycemia", "metformin",
        "मधुमेह", "शुगर", "डायबिटीज"
    ],
    "tuberculosis": [
        "tb", "tuberculosis", "cough", "coughing", "sputum", "chest",
        "lungs", "pulmonary", "dot", "rifampicin", "isoniazid",
        "क्षयरोग", "टीबी", "खांसी"
    ],
    "maternity": [
        "pregnant", "pregnancy", "delivery", "prenatal", "antenatal",
        "postnatal", "maternity", "childbirth", "labour", "labor",
        "newborn", "जननी", "गर्भवती", "प्रसव", "डिलीवरी"
    ],
    "child_health": [
        "child", "infant", "baby", "vaccination", "immunization",
        "pediatric", "paediatric", "newborn", "toddler", "growth",
        "बच्चा", "शिशु", "टीकाकरण"
    ],
    "mental_health": [
        "depression", "anxiety", "mental", "psychiatric", "psychiatry",
        "stress", "trauma", "bipolar", "schizophrenia", "counselling",
        "therapy", "अवसाद", "मानसिक", "तनाव"
    ],
    "eye_disease": [
        "eye", "vision", "cataract", "glaucoma", "retina", "blindness",
        "ophthalmology", "cornea", "spectacles", "आँख", "दृष्टि", "मोतियाबिंद"
    ],
    "trauma": [
        "accident", "injury", "fracture", "trauma", "emergency",
        "surgery", "operation", "wound", "burn", "दुर्घटना", "चोट"
    ],
}

def detect_conditions(text: str) -> list[str]:
    """Return list of matched condition keys, most specific first."""
    text_lower = text.lower()
    
    # Tokenize and lemmatize
    try:
        tokens = word_tokenize(text_lower)
        lemmatized = [lemmatizer.lemmatize(t) for t in tokens if t.isalpha() and t not in STOP_WORDS]
    except Exception:
        lemmatized = text_lower.split()

    scores = {}
    for condition, keywords in CONDITION_KEYWORDS.items():
        score = 0
        for kw in keywords:
            kw_lower = kw.lower()
            # Multi-word phrase match (higher weight)
            if ' ' in kw_lower and kw_lower in text_lower:
                score += 3
            # Single-word exact match against lemmatized tokens
            elif kw_lower in lemmatized:
                score += 2
            # Partial substring match (lower weight)
            elif kw_lower in text_lower:
                score += 1
        if score > 0:
            scores[condition] = score

    # Sort by score descending
    sorted_conditions = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [c for c, _ in sorted_conditions]

@app.route('/nlp/detect', methods=['POST'])
def detect():
    """POST { "text": "..." } → { "conditions": [...], "confidence": {...} }"""
    body = request.get_json(silent=True) or {}
    text = body.get('text', '').strip()
    
    if not text:
        return jsonify({"error": "text field required"}), 400
    
    conditions = detect_conditions(text)
    
    # Build confidence map for transparency
    confidence = {}
    text_lower = text.lower()
    for cond in conditions:
        matched_kws = [kw for kw in CONDITION_KEYWORDS.get(cond, []) if kw.lower() in text_lower]
        confidence[cond] = {
            "matched_keywords": matched_kws,
            "count": len(matched_kws)
        }

    return jsonify({
        "conditions": conditions,
        "confidence": confidence,
        "primary": conditions[0] if conditions else "general"
    })

@app.route('/nlp/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "MedBridge NLP"})

if __name__ == '__main__':
    app.run(port=5001, debug=False)
