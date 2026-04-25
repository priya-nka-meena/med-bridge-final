import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SchemeCard         from '../components/SchemeCard';
import HospitalCard       from '../components/HospitalCard';
import ConditionBadge from '../components/ConditionBadge';
import HospitalMapLeaflet from '../components/HospitalMapLeaflet';
import PdfExport          from '../components/PdfExport';
import translations       from '../translations';

const CONDITION_DISPLAY = {
  kidney_disease:'Kidney Disease', cancer:'Cancer',
  heart_disease:'Heart Disease',   diabetes:'Diabetes',
  tuberculosis:'Tuberculosis',     maternity:'Maternity',
  child_health:'Child Health',     mental_health:'Mental Health',
  eye_disease:'Eye Disease',       trauma:'Trauma / Injury',
  general:'General',
};

export default function Results() {
  const navigate = useNavigate();
  const { state: navState } = useLocation();

  const [data,           setData]           = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [lang,           setLang]           = useState(navState?.lang || 'en');
  const [showMap,        setShowMap]        = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedHosp,   setSelectedHosp]  = useState(null);
  const [userCoords,     setUserCoords]     = useState(null);

  const t = translations[lang] || translations['en'];

  useEffect(() => {
    if (!navState?.query) navigate('/', { replace: true });
  }, [navState, navigate]);

  useEffect(() => {
    if (!navState?.pincode && !userCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!navState?.query) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        query:   navState.query,
        state:   navState.state   || 'Delhi',
        bpl:     navState.bpl     || false,
        lang,
        pincode: navState.pincode || undefined,
        income:  navState.income  || undefined,
      };
      const res = await axios.post('/api/search', payload);
      setData(res.data);
      if (res.data.meta?.coords) setUserCoords(res.data.meta.coords);
      if (res.data.schemes?.[0])   setSelectedScheme(res.data.schemes[0]);
      if (res.data.hospitals?.[0]) setSelectedHosp(res.data.hospitals[0]);
    } catch (e) {
      setError(e?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navState, lang]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="fullscreen-center">
        <div className="big-spinner" />
        <p className="loading-title">
          {lang === 'hi' ? 'आपके लिए योजनाएं ढूंढ रहे हैं…' : 'Finding schemes for you…'}
        </p>
        <p className="loading-sub">
          {lang === 'hi' ? 'सरकारी कार्यक्रमों में पात्रता जांच रहे हैं' : 'Checking eligibility across government programmes'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fullscreen-center">
        <span style={{ fontSize: 48 }}>⚠️</span>
        <h2 style={{ marginTop: 12 }}>Something went wrong</h2>
        <p style={{ color: '#666', margin: '8px 0 20px' }}>{error}</p>
        <button className="back-btn" onClick={() => navigate('/')}>← Try Again</button>
      </div>
    );
  }

  if (!data) return null;

  const { conditions = [], schemes = [], hospitals = [], meta = {} } = data;
  const topScheme   = schemes[0]   || null;
  const topHospital = hospitals[0] || null;

  return (
    <div className="results-page">

      <header className="results-header">
        <button className="back-btn" onClick={() => navigate('/')}>{t.newSearch || '← New Search'}</button>
        <span className="results-header__brand">🏥 MedBridge</span>
        <div className="results-header__badges">
          {meta.location_resolved && (
            <span className="header-pill header-pill--green">{t.sortedByDist || '📍 Sorted by distance'}</span>
          )}
          <span className="header-pill header-pill--blue">
            {schemes.length} {t.found || 'found'}
          </span>
          <PdfExport
            scheme={selectedScheme || topScheme}
            hospital={selectedHosp || topHospital}
            condition={CONDITION_DISPLAY[conditions[0]] || conditions[0]}
            query={navState?.query}
          />
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`lang-btn ${lang === 'hi' ? 'lang-btn--active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
          </div>
        </div>
      </header>

      <main className="results-main">

        <div className="results-echo">
          {t.showingFor || 'Showing results for:'} <em>"{navState?.query}"</em>
          {navState?.state && <span> · {navState.state}</span>}
          {navState?.bpl   && <span> · BPL</span>}
        </div>

        <div className="pdf-selection-notice">
          📄 PDF will include: <strong>{(selectedScheme || topScheme)?.name_en || 'Top scheme'}</strong>
          {' '}+ <strong>{(selectedHosp || topHospital)?.name || 'Top hospital'}</strong>.
          {' '}Click a card below to change selection.
        </div>

        <section className="results-section">
          <h2 className="results-section__title">{t.detectedConditions || '🧠 Detected Conditions'}</h2>
          {conditions.length === 0 ? (
            <p className="muted">{t.noCondition}</p>
          ) : (
            <div className="conditions-row">
              {conditions.map((c, i) => (
                <ConditionBadge key={c} condition={c} isPrimary={i === 0} />
              ))}
            </div>
          )}
        </section>

        {topScheme && (
          <div className="top-rec-banner">
            <div className="top-rec-banner__label">{t.topRec || '⭐ Top Recommendation'}</div>
            <div className="top-rec-banner__body">
              <div className="top-rec-banner__left">
                <h3 className="top-rec-banner__name">
                  {lang === 'hi' ? topScheme.name_hi : topScheme.name_en}
                </h3>
                <p className="top-rec-banner__desc">
                  {lang === 'hi' ? topScheme.description_hi : topScheme.description_en}
                </p>
              </div>
              <div className="top-rec-banner__stats">
                <div className="stat-box">
                  <span className="stat-box__num">{topScheme.documents?.length || 0}</span>
                  <span className="stat-box__lbl">{t.docsNeeded || 'Docs needed'}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-box__num">{hospitals.length}</span>
                  <span className="stat-box__lbl">{t.hospitals || 'Hospitals'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {hospitals.length > 0 && (
          <button className="map-toggle-btn" onClick={() => setShowMap(v => !v)}>
            {showMap
              ? (lang === 'hi' ? '🗺️ मानचित्र छुपाएं' : '🗺️ Hide Map')
              : (lang === 'hi' ? '🗺️ अस्पतालों का मानचित्र देखें' : '🗺️ Show Hospitals on Map')}
          </button>
        )}

        {showMap && hospitals.length > 0 && (
          <div className="leaflet-section">
            <HospitalMapLeaflet hospitals={hospitals} userCoords={userCoords} />
          </div>
        )}

        <div className="results-cols">
          <section className="results-col">
            <div className="col-header">
              <h2 className="col-header__title">{t.govSchemes || '💊 Government Schemes'}</h2>
              <span className="col-header__count">{schemes.length} {t.found || 'found'}</span>
            </div>

            {schemes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">🔍</span>
                <p className="empty-state__title">{t.noSchemes}</p>
                <p className="empty-state__hint">{t.noSchemesHint}</p>
                <button className="retry-btn" onClick={() => navigate('/')}>{t.tryDifferent}</button>
              </div>
            ) : (
              <div className="cards-stack">
                {schemes.map((s, i) => (
                  <div
                    key={s.id}
                    className={`card-anim card-selectable ${selectedScheme?.id === s.id ? 'card-selectable--active' : ''}`}
                    style={{ animationDelay: `${i * 55}ms` }}
                    onClick={() => setSelectedScheme(s)}
                    title="Click to select for PDF"
                  >
                    {selectedScheme?.id === s.id && (
                      <div className="card-selected-badge">✓ Selected for PDF</div>
                    )}
                    <SchemeCard scheme={s} lang={lang} isTop={i === 0} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="results-col">
            <div className="col-header">
              <h2 className="col-header__title">{t.nearbyHospitals || '🏥 Nearby Hospitals'}</h2>
              <span className="col-header__count">{hospitals.length} {t.found || 'found'}</span>
            </div>

            {hospitals.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">🏥</span>
                <p className="empty-state__title">{t.noHospitals}</p>
                <p className="empty-state__hint">{t.noHospitalsHint}</p>
              </div>
            ) : (
              <div className="cards-stack">
                {hospitals.map((h, i) => (
                  <div
                    key={h.id || i}
                    className={`card-anim card-selectable ${selectedHosp?.id === h.id ? 'card-selectable--active' : ''}`}
                    style={{ animationDelay: `${i * 55}ms` }}
                    onClick={() => setSelectedHosp(h)}
                    title="Click to select for PDF"
                  >
                    {selectedHosp?.id === h.id && (
                      <div className="card-selected-badge card-selected-badge--green">✓ Selected for PDF</div>
                    )}
                    <HospitalCard hospital={h} />
                  </div>
                ))}
              </div>
            )}

            {topScheme && (
              <div className="doc-checklist">
                <h3 className="doc-checklist__title">
                  {t.docsFor || '📋 Documents for'} {lang === 'hi' ? topScheme.name_hi : topScheme.name_en}
                </h3>
                <ul className="doc-checklist__list">
                  {topScheme.documents.map((doc, i) => (
                    <li key={i} className="doc-checklist__item">
                      <span className="doc-checklist__check">✓</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
                <p className="doc-checklist__apply">{t.applyAt || '📍'} {topScheme.apply_at}</p>
              </div>
            )}
          </section>

        </div>
      </main>

      <footer className="results-footer">{t.footer}</footer>
    </div>
  );
}
