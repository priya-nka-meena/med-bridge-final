import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import translations from '../translations';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import VoiceButton from '../components/VoiceButton';

const EXAMPLES_EN = [
  { label: '🫁 Kidney Dialysis',   query: 'My father needs kidney dialysis treatment' },
  { label: '🤰 Pregnancy',         query: 'My wife is pregnant and needs free delivery' },
  { label: '🫁 TB Treatment',      query: 'Coughing for months, suspected tuberculosis' },
  { label: '💉 Diabetes Care',     query: 'Need support managing blood sugar levels' },
  { label: '🧠 Mental Health',     query: 'Feeling depressed and anxious, need counselling' },
  { label: '👶 Child Vaccination', query: 'Baby needs vaccination and health checkup' },
  { label: '❤️ Heart Disease',     query: 'Need bypass surgery, looking for free cardiac care' },
  { label: '👁️ Eye Surgery',       query: 'Mother needs cataract operation' },
];

const EXAMPLES_HI = [
  { label: '🫁 किडनी डायलिसिस',    query: 'पिताजी को किडनी डायलिसिस चाहिए' },
  { label: '🤰 गर्भावस्था',         query: 'पत्नी गर्भवती हैं, मुफ्त प्रसव चाहिए' },
  { label: '🫁 टीबी उपचार',         query: 'महीनों से खांसी है, टीबी हो सकती है' },
  { label: '💉 मधुमेह',             query: 'ब्लड शुगर नियंत्रण के लिए मदद चाहिए' },
  { label: '🧠 मानसिक स्वास्थ्य',  query: 'अवसाद और चिंता हो रही है, परामर्श चाहिए' },
  { label: '👶 बच्चे का टीकाकरण',  query: 'बच्चे का टीकाकरण और जांच करानी है' },
  { label: '❤️ हृदय रोग',          query: 'बाईपास सर्जरी चाहिए, मुफ्त इलाज' },
  { label: '👁️ मोतियाबिंद',        query: 'माँ को मोतियाबिंद ऑपरेशन चाहिए' },
];

const STATES = [
  'Delhi', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Tamil Nadu',
  'Maharashtra', 'West Bengal', 'Karnataka', 'Madhya Pradesh', 'Gujarat',
  'Kerala', 'Andhra Pradesh', 'Telangana', 'Punjab', 'Odisha',
  'Assam', 'Himachal Pradesh', 'Uttarakhand', 'Chhattisgarh',
];

export default function Home() {
  const navigate = useNavigate();
  const { state: loc } = useLocation();

  const [lang,    setLang]    = useState(loc?.lang || 'en');
  const [query,   setQuery]   = useState(loc?.prefillQuery || '');
  const [pincode, setPincode] = useState('');
  const [state,   setState]   = useState('Delhi');
  const [bpl,     setBpl]     = useState(false);
  const [income,  setIncome]  = useState('');
  const [age,     setAge]     = useState('');
  const [gender,  setGender]  = useState('');
  const [err,     setErr]     = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const { listening, transcript, supported, error: voiceError, detectedLanguage, startListening, stopListening, clearTranscript } = useVoiceSearch(lang);

  const t        = translations[lang];
  const EXAMPLES = lang === 'hi' ? EXAMPLES_HI : EXAMPLES_EN;

  // Update query when voice transcript changes
  React.useEffect(() => {
    if (transcript && !listening) {
      setQuery(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript, listening]);

  function validate() {
    if (!query.trim()) { setErr(t.errorEmpty); return false; }
    if (pincode && !/^\d{6}$/.test(pincode.trim())) { setErr(t.errorPincode); return false; }
    if (age && (isNaN(age) || Number(age) < 0 || Number(age) > 120)) { setErr('Please enter a valid age (0–120).'); return false; }
    setErr('');
    return true;
  }

  function handleLocationUpdate(locationData) {
    setUserLocation(locationData);
    
    // Auto-fill state and pincode if available from location
    if (locationData.state && !state) {
      setState(locationData.state);
    }
    if (locationData.pincode && !pincode) {
      setPincode(locationData.pincode);
    }
  }

  function handleSearch() {
    if (!validate()) return;
    navigate('/results', {
      state: { 
        query: query.trim(), 
        pincode: pincode.trim(), 
        state, 
        bpl, 
        income: income ? Number(income) : undefined, 
        age: age ? Number(age) : undefined, 
        gender: gender || undefined,
        lang,
        userLocation 
      },
    });
  }

  return (
    <div className="home">
      <nav className="home__nav">
        <div className="home__nav-brand" onClick={() => navigate('/landing')}>
          🏥 <b>Med</b>Bridge
        </div>
        <div className="home__nav-right">
          <button className="home__nav-back" onClick={() => navigate('/landing')}>
            ← Back
          </button>
          <div className={`lang-toggle`}>
            <button className={`lang-btn${lang==='en'?' lang-btn--active':''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`lang-btn${lang==='hi'?' lang-btn--active':''}`} onClick={() => setLang('hi')}>हिं</button>
          </div>
        </div>
      </nav>

      <header className="home__hero">
        <div className="home__hero-badge">🏛️ Official Government Health Schemes</div>
        <h1 className="home__hero-title">
          {t.heroTitle}<br />
          <span className="home__hero-accent">{t.heroAccent}</span>
        </h1>
        <p className="home__hero-sub">{t.heroSub}</p>
      </header>

      <section className="home__card-wrap">
        <div className="home__card">
          <label className="field-label">{t.describeLabel}</label>
          <div style={{ position: 'relative' }}>
            <textarea
              className="field-textarea"
              placeholder={t.descPlaceholder}
              value={query} rows={3}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
            />
            {supported && (
              <VoiceButton
                listening={listening}
                supported={supported}
                onStart={startListening}
                onStop={stopListening}
                lang={lang}
                detectedLanguage={detectedLanguage}
                transcript={transcript}
                error={voiceError}
              />
            )}
          </div>
          {voiceError && (
            <p className="home__error" style={{ marginTop: 8 }}>🎤 {voiceError}</p>
          )}

          
          {/* Quick examples */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i}
                onClick={() => setQuery(ex.query)}
                style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: query === ex.query ? 'var(--blue-light)' : 'var(--gray-100)',
                  border: `1.5px solid ${query === ex.query ? 'var(--blue-muted)' : 'var(--gray-200)'}`,
                  fontSize: 12, fontWeight: 500, color: query === ex.query ? 'var(--blue)' : 'var(--gray-600)',
                  cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--font)',
                }}
              >{ex.label}</button>
            ))}
          </div>

          <div className="home__fields" style={{ marginTop: 20 }}>
            <div className="field-group">
              <label className="field-label">{t.stateLabel}</label>
              <select className="field-select" value={state} onChange={e => setState(e.target.value)}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">{t.pincodeLabel} <span className="field-hint">{t.pincodeHint}</span></label>
              <input className="field-input" type="text" placeholder="e.g. 110001" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">{t.ageLabel} <span className="field-hint">{t.ageHint}</span></label>
              <input className="field-input" type="number" placeholder="e.g. 45" min={0} max={120} value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">{t.genderLabel} <span className="field-hint">{t.genderHint}</span></label>
              <select className="field-select" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">{t.incomeLabel} <span className="field-hint">{t.incomeHint}</span></label>
              <input className="field-input" type="number" placeholder="e.g. 150000" min={0} value={income} onChange={e => setIncome(e.target.value)} />
            </div>
            <div className="field-group field-group--center">
              <label className="bpl-wrap">
                <input type="checkbox" checked={bpl} onChange={e => setBpl(e.target.checked)} />
                <span>{t.bplLabel}</span>
              </label>
            </div>
          </div>

          {err && <p className="home__error">⚠️ {err}</p>}

          <button className="home__btn" onClick={handleSearch}>{t.searchBtn}</button>
        </div>
      </section>

      <section className="trust-strip">
        {[
          { icon: '🏛️', text: t.trust1 },
          { icon: '🏥', text: t.trust2 },
          { icon: '🆓', text: t.trust3 },
          { icon: '🌐', text: t.trust4 },
          { icon: '🔒', text: 'No Registration' },
        ].map((item, i) => (
          <div key={i} className="trust-item"><span>{item.icon}</span><span>{item.text}</span></div>
        ))}
      </section>

      <footer className="home__footer">{t.footer}</footer>
    </div>
  );
}
