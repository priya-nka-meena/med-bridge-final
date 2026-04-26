import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations';
import schemesCatalog from '../data/schemesCatalog';

export default function Landing() {
  const navigate = useNavigate();
  const [lang,    setLang]    = useState('en');
  const [search,  setSearch]  = useState('');
  const t = translations[lang];

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate('/home', { state: { prefillQuery: search.trim(), lang } });
    } else {
      navigate('/home');
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

          <button 
            className="landing__schemes-btn" 
            onClick={() => navigate('/all-schemes')}
          >
            📋 {t.exploreSchemes}
          </button>

          <a
            href="https://www.india.gov.in/my-government/schemes/search?schemeCategory=5&schemeCategoryName=Health%20%26%20Wellness"
            target="_blank"
            rel="noopener noreferrer"
            className="landing__gov-link"
          >
            🏛️ {t.exploreSchemes}
          </a>

          <button className="landing__cta" onClick={() => navigate('/home')}>
            {t.landingCta}
          </button>
        </div>

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

      <section className="landing__section">
        <div className="landing__section-inner">
          <h2 className="landing__section-title">{lang === 'hi' ? 'लोकप्रिय स्वास्थ्य योजनाएं' : 'Popular Health Schemes'}</h2>
          <div className="schemes-showcase">
            <div className="schemes-scroll-controls">
              <button 
                className="schemes-scroll-btn schemes-scroll-btn--left"
                onClick={() => document.querySelector('.schemes-scroll').scrollBy({ left: -300, behavior: 'smooth' })}
              >
                ←
              </button>
              <button 
                className="schemes-scroll-btn schemes-scroll-btn--right"
                onClick={() => document.querySelector('.schemes-scroll').scrollBy({ left: 300, behavior: 'smooth' })}
              >
                →
              </button>
            </div>
            <div className="schemes-scroll">
              {schemesCatalog.map((scheme, i) => (
                <div key={scheme.id} className="scheme-preview-card" onClick={() => navigate('/home', { state: { prefillQuery: lang === 'hi' ? scheme.description_hi : scheme.description_en, lang } })}>
                  <div className="scheme-preview-header">
                    <h3 className="scheme-preview-title">{lang === 'hi' ? scheme.name_hi : scheme.name_en}</h3>
                    <span className="scheme-preview-badge">
                      {scheme.bpl_required ? (lang === 'hi' ? 'बीपीएल' : 'BPL') : (lang === 'hi' ? 'सभी के लिए' : 'Open to all')}
                    </span>
                  </div>
                  <p className="scheme-preview-desc">
                    {lang === 'hi' ? scheme.description_hi : scheme.description_en}
                  </p>
                  <div className="scheme-preview-footer">
                    <span className="scheme-preview-docs">
                      📋 {scheme.documents.length} {lang === 'hi' ? 'दस्तावेज़' : 'documents'}
                    </span>
                    <span className="scheme-preview-apply">
                      📍 {lang === 'hi' ? 'आवेदन करें' : 'Apply at'} {scheme.apply_at.split(',')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      <section className="landing__cta-banner">
        <h2 className="landing__cta-banner-title">
          {lang === 'hi' ? 'आज ही शुरू करें — यह मुफ़्त है' : 'Start Now — It\'s Completely Free'}
        </h2>
        <p className="landing__cta-banner-sub">
          {lang === 'hi'
            ? 'कोई पंजीकरण नहीं। कोई शुल्क नहीं। सिर्फ मदद।'
            : 'No registration. No fees. Just help.'}
        </p>
        <button className="landing__cta landing__cta--white" onClick={() => navigate('/home')}>
          {t.landingCta}
        </button>
      </section>

      <footer className="landing__footer">
        {t.footer}
      </footer>
    </div>
  );
}
