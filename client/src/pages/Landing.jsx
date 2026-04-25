import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations';

export default function Landing() {
  const navigate = useNavigate();
  const [lang,    setLang]    = useState('en');
  const [search,  setSearch]  = useState('');
  const t = translations[lang];

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate('/', { state: { prefillQuery: search.trim(), lang } });
    } else {
      navigate('/');
    }
  }

  const features = [
    { icon: '🧠', title: t.feat1, desc: t.feat1desc },
    { icon: '📋', title: t.feat2, desc: t.feat2desc },
    { icon: '🏥', title: t.feat3, desc: t.feat3desc },
  ];

  const steps = [
    { num: '01', title: t.step1Title, desc: t.step1Desc, icon: '✍️' },
    { num: '02', title: t.step2Title, desc: t.step2Desc, icon: '🤖' },
    { num: '03', title: t.step3Title, desc: t.step3Desc, icon: '🗺️' },
  ];

  return (
    <div className="landing">

      {/* ── NAVBAR ── */}
      <nav className="landing__nav">
        <span className="landing__nav-brand">{t.brand}</span>
        <div className="landing__nav-right">
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`}
              onClick={() => setLang('en')}
            >EN</button>
            <button
              className={`lang-btn ${lang === 'hi' ? 'lang-btn--active' : ''}`}
              onClick={() => setLang('hi')}
            >हिं</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing__hero">
        <div className="landing__hero-glow" />
        <div className="landing__hero-content">
          <div className="landing__trust-badge">
            🏛️ Government of India · Verified Schemes
          </div>

          <h1 className="landing__hero-title">
            {t.landingHero}
          </h1>
          <p className="landing__hero-sub">{t.landingHeroSub}</p>

          {/* Search bar */}
          <form className="landing__search-bar" onSubmit={handleSearch}>
            <span className="landing__search-icon">🔍</span>
            <input
              type="text"
              className="landing__search-input"
              placeholder={t.landingSearch}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="landing__search-submit">
              {lang === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </form>

          {/* Government schemes link */}
          <a
            href="https://www.india.gov.in/my-government/schemes/search?schemeCategory=5&schemeCategoryName=Health%20%26%20Wellness"
            target="_blank"
            rel="noopener noreferrer"
            className="landing__gov-link"
          >
            🏛️ {t.exploreSchemes}
          </a>

          {/* Primary CTA */}
          <button className="landing__cta" onClick={() => navigate('/')}>
            {t.landingCta}
          </button>
        </div>

        {/* Stats strip */}
        <div className="landing__stats">
          <div className="landing__stat">
            <span className="landing__stat-num">{t.stat1}</span>
            <span className="landing__stat-sub">{t.stat1sub}</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <span className="landing__stat-num">{t.stat2}</span>
            <span className="landing__stat-sub">{t.stat2sub}</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat">
            <span className="landing__stat-num">{t.stat3}</span>
            <span className="landing__stat-sub">{t.stat3sub}</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing__section">
        <div className="landing__section-inner">
          <h2 className="landing__section-title">{t.howItWorks}</h2>
          <div className="landing__steps">
            {steps.map((step, i) => (
              <div key={i} className="landing__step">
                <div className="landing__step-num">{step.num}</div>
                <div className="landing__step-icon">{step.icon}</div>
                <h3 className="landing__step-title">{step.title}</h3>
                <p className="landing__step-desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="landing__step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing__section landing__section--gray">
        <div className="landing__section-inner">
          <h2 className="landing__section-title">{t.features}</h2>
          <div className="landing__features">
            {features.map((f, i) => (
              <div key={i} className="landing__feature-card">
                <div className="landing__feature-icon">{f.icon}</div>
                <h3 className="landing__feature-title">{f.title}</h3>
                <p className="landing__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="landing__cta-banner">
        <h2 className="landing__cta-banner-title">
          {lang === 'hi' ? 'आज ही शुरू करें — यह मुफ़्त है' : 'Start Now — It\'s Completely Free'}
        </h2>
        <p className="landing__cta-banner-sub">
          {lang === 'hi'
            ? 'कोई पंजीकरण नहीं। कोई शुल्क नहीं। सिर्फ मदद।'
            : 'No registration. No fees. Just help.'}
        </p>
        <button className="landing__cta landing__cta--white" onClick={() => navigate('/')}>
          {t.landingCta}
        </button>
      </section>

      <footer className="landing__footer">
        {t.footer}
      </footer>
    </div>
  );
}
