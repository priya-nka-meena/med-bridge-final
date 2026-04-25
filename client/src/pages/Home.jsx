import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import translations from '../translations';
import VoiceButton from '../components/VoiceButton';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

const EXAMPLES_EN = [
  { label: '🫁 Dialysis',       query: 'My father needs kidney dialysis' },
  { label: '🤰 Pregnancy',      query: 'My wife is pregnant, need free delivery' },
  { label: '🫁 TB',             query: 'Coughing for months, suspected tuberculosis' },
  { label: '💉 Diabetes',       query: 'Managing blood sugar, need diabetes support' },
  { label: '🧠 Mental Health',  query: 'Feeling depressed and anxious, need help' },
  { label: '👶 Child Health',   query: 'Baby needs vaccination and health checkup' },
];

const EXAMPLES_HI = [
  { label: '🫁 डायलिसिस',         query: 'पिताजी को किडनी डायलिसिस की जरूरत है' },
  { label: '🤰 गर्भावस्था',        query: 'पत्नी गर्भवती हैं, मुफ़्त प्रसव चाहिए' },
  { label: '🫁 टीबी',              query: 'महीनों से खांसी है, टीबी हो सकती है' },
  { label: '💉 मधुमेह',            query: 'शुगर कंट्रोल करनी है, मदद चाहिए' },
  { label: '🧠 मानसिक स्वास्थ्य',  query: 'अवसाद और चिंता महसूस हो रही है' },
  { label: '👶 बच्चे का स्वास्थ्य', query: 'बच्चे का टीकाकरण और जांच चाहिए' },
];

const STATES = [
  'Delhi','Uttar Pradesh','Bihar','Rajasthan','Tamil Nadu',
  'Maharashtra','West Bengal','Karnataka','Madhya Pradesh','Gujarat',
];

export default function Home() {
  const navigate       = useNavigate();
  const { state: loc } = useLocation();

  const [lang,       setLang]       = useState(loc?.lang || 'en');
  const [query,      setQuery]      = useState(loc?.prefillQuery || '');
  const [pincode,    setPincode]    = useState('');
  const [state,      setState]      = useState('Delhi');
  const [bpl,        setBpl]        = useState(false);
  const [income,     setIncome]     = useState('');
  const [err,        setErr]        = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  const {
    listening, transcript, supported, error: voiceErr,
    startListening, stopListening,
  } = useVoiceSearch(lang);

  useEffect(() => { if (transcript) setQuery(transcript); }, [transcript]);

  const t        = translations[lang] || translations['en'];
  const EXAMPLES = lang === 'hi' ? EXAMPLES_HI : EXAMPLES_EN;

  function validate() {
    if (!query.trim()) { setErr(t.errorEmpty || 'Please describe your health problem.'); return false; }
    if (pincode && !/^\d{6}$/.test(pincode.trim())) {
      setErr(t.errorPincode || 'Pincode must be exactly 6 digits.'); return false;
    }
    setErr('');
    return true;
  }

  function handleSearch() {
    if (!validate()) return;
    navigate('/results', {
      state: {
        query:   query.trim(),
        pincode: pincode.trim(),
        state,
        bpl,
        income: income ? Number(income) : undefined,
        lang,
      },
    });
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); }
  }

  function detectLocation() {
    if (!navigator.geolocation) { setErr('Geolocation not supported by your browser.'); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'User-Agent': 'MedBridge/1.0' } }
          );
          const data = await resp.json();
          const pc = data?.address?.postcode;
          if (pc) setPincode(pc.replace(/\D/g, '').slice(0, 6));
        } catch { /* ignore */ }
        setGeoLoading(false);
      },
      () => { setErr('Could not get your location. Please enter pincode manually.'); setGeoLoading(false); },
      { timeout: 8000 }
    );
  }

  return (
    <div className="home">
      <nav className="home__nav">
        <span className="home__nav-brand" onClick={() => navigate('/landing')} style={{ cursor: 'pointer' }}>
          🏥 MedBridge
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="sb-nav-link" onClick={() => navigate('/schemes')}>
            📋 Browse Schemes
          </button>
          <span className="home__nav-tag">{t.tagline}</span>
          <div className="lang-toggle lang-toggle--nav">
            <button className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`lang-btn ${lang === 'hi' ? 'lang-btn--active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
          </div>
        </div>
      </nav>

      <header className="home__hero">
        <h1 className="home__hero-title">
          {t.heroTitle || 'Healthcare schemes,'}<br />
          <span className="home__hero-accent">{t.heroAccent || 'found in seconds.'}</span>
        </h1>
        <p className="home__hero-sub">{t.heroSub}</p>
      </header>

      <section className="home__card-wrap">
        <div className="home__card">
          <label className="field-label">{t.describeLabel || 'Describe the health problem'}</label>

          <div className="query-row">
            <textarea
              className="field-textarea"
              placeholder={t.descPlaceholder}
              value={query}
              rows={3}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
            />
            <VoiceButton
              listening={listening}
              supported={supported}
              onStart={startListening}
              onStop={stopListening}
              lang={lang}
            />
          </div>

          {listening && (
            <div className="voice-status">
              <span className="voice-status__dot" />
              {lang === 'hi' ? 'सुन रहे हैं…' : 'Listening… speak now'}
            </div>
          )}
          {voiceErr && <p className="voice-error">{voiceErr}</p>}

          <div className="chip-row">
            <span className="chip-row__label">{t.tryLabel || 'Try:'}</span>
            {EXAMPLES.map((ex, i) => (
              <button key={i} className="chip" onClick={() => setQuery(ex.query)}>{ex.label}</button>
            ))}
          </div>

          <div className="home__fields">
            <div className="field-group">
              <label className="field-label">{t.stateLabel || 'State'}</label>
              <select className="field-select" value={state} onChange={e => setState(e.target.value)}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">
                {t.pincodeLabel || 'Pincode'}
                <span className="field-hint"> {t.pincodeHint || '(for nearest hospitals)'}</span>
              </label>
              <div className="pincode-row">
                <input
                  className="field-input"
                  type="text"
                  placeholder="e.g. 110001"
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                />
                <button
                  type="button"
                  className="geo-btn"
                  onClick={detectLocation}
                  disabled={geoLoading}
                  title="Use my current location"
                >
                  {geoLoading ? '⏳' : '📍'}
                </button>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">
                {t.incomeLabel || 'Annual Income ₹'}
                <span className="field-hint"> {t.incomeHint || '(optional)'}</span>
              </label>
              <input
                className="field-input"
                type="number"
                placeholder="e.g. 150000"
                min={0}
                value={income}
                onChange={e => setIncome(e.target.value)}
              />
            </div>

            <div className="field-group field-group--center">
              <label className="bpl-label">
                <input type="checkbox" checked={bpl} onChange={e => setBpl(e.target.checked)} className="bpl-checkbox" />
                <span>{t.bplLabel || 'BPL Cardholder'}</span>
              </label>
              <p className="field-hint" style={{ marginTop: 4 }}>{t.bplHint}</p>
            </div>
          </div>

          {err && <p className="home__error">⚠️ {err}</p>}

          <button className="home__btn" onClick={handleSearch}>
            {t.searchBtn || '🔍 Find Schemes'}
          </button>
        </div>
      </section>

      <section className="trust-strip">
        {['🏛️','🏥','🆓','🌐'].map((icon, i) => (
          <React.Fragment key={i}>
            <div className="trust-item">
              <span>{icon}</span>
              <span>{[t.trust1, t.trust2, t.trust3, t.trust4][i]}</span>
            </div>
            {i < 3 && <div className="trust-divider" />}
          </React.Fragment>
        ))}
      </section>

      <footer className="home__footer">{t.footer}</footer>
    </div>
  );
}
