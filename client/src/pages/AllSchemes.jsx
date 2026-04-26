import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations';
import schemesCatalog from '../data/schemesCatalog';

const CATEGORIES = [
  { id: 'all', name_en: 'All Schemes', name_hi: 'सभी योजनाएं' },
  { id: 'health_insurance', name_en: 'Health Insurance', name_hi: 'स्वास्थ्य बीमा' },
  { id: 'maternal_health', name_en: 'Maternal Health', name_hi: 'मातृ स्वास्थ्य' },
  { id: 'child_health', name_en: 'Child Health', name_hi: 'बाल स्वास्थ्य' },
  { id: 'mental_health', name_en: 'Mental Health', name_hi: 'मानसिक स्वास्थ्य' },
  { id: 'infectious_diseases', name_en: 'Infectious Diseases', name_hi: 'संक्रामक रोग' },
  { id: 'chronic_diseases', name_en: 'Chronic Diseases', name_hi: 'पुरानी बीमारियां' },
];

const CONDITIONS = [
  { id: 'all', name_en: 'All Conditions', name_hi: 'सभी स्थितियां' },
  { id: 'kidney_disease', name_en: 'Kidney Disease', name_hi: 'गुर्दे की बीमारी' },
  { id: 'cancer', name_en: 'Cancer', name_hi: 'कैंसर' },
  { id: 'heart_disease', name_en: 'Heart Disease', name_hi: 'हृदय रोग' },
  { id: 'diabetes', name_en: 'Diabetes', name_hi: 'मधुमेह' },
  { id: 'tuberculosis', name_en: 'Tuberculosis', name_hi: 'तपेदिक' },
  { id: 'maternity', name_en: 'Maternity', name_hi: 'प्रसव' },
  { id: 'child_health', name_en: 'Child Health', name_hi: 'बाल स्वास्थ्य' },
  { id: 'mental_health', name_en: 'Mental Health', name_hi: 'मानसिक स्वास्थ्य' },
];

const STATES = [
  'All States', 'Delhi', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Tamil Nadu',
  'Maharashtra', 'West Bengal', 'Karnataka', 'Madhya Pradesh', 'Gujarat',
  'Kerala', 'Andhra Pradesh', 'Telangana', 'Punjab', 'Odisha',
  'Assam', 'Himachal Pradesh', 'Uttarakhand', 'Chhattisgarh',
];

export default function AllSchemes() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedState, setSelectedState] = useState('All States');
  const [incomeLevel, setIncomeLevel] = useState('all');
  const [bplOnly, setBplOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const t = translations[lang];

  const filteredSchemes = useMemo(() => {
    let filtered = schemesCatalog;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scheme => 
        (lang === 'en' ? scheme.name_en : scheme.name_hi).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lang === 'en' ? scheme.description_en : scheme.description_hi).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(scheme => 
        scheme.condition && scheme.condition.includes(selectedCondition)
      );
    }

    // State filter
    if (selectedState !== 'All States') {
      filtered = filtered.filter(scheme => 
        scheme.states === 'all' || (scheme.states && scheme.states.includes(selectedState))
      );
    }

    // Income filter
    if (incomeLevel === 'bpl') {
      filtered = filtered.filter(scheme => scheme.bpl_required);
    } else if (incomeLevel === 'low_income') {
      filtered = filtered.filter(scheme => 
        scheme.income_limit && scheme.income_limit <= 150000
      );
    } else if (incomeLevel === 'middle_income') {
      filtered = filtered.filter(scheme => 
        !scheme.income_limit || scheme.income_limit <= 500000
      );
    }

    // BPL only filter
    if (bplOnly) {
      filtered = filtered.filter(scheme => !scheme.bpl_required);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return (lang === 'en' ? a.name_en : a.name_hi).localeCompare(lang === 'en' ? b.name_en : b.name_hi);
      } else if (sortBy === 'income') {
        return (a.income_limit || Infinity) - (b.income_limit || Infinity);
      } else if (sortBy === 'documents') {
        return a.documents.length - b.documents.length;
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedCondition, selectedState, incomeLevel, bplOnly, sortBy, lang]);

  const handleSchemeClick = (scheme) => {
    const query = lang === 'en' ? scheme.description_en : scheme.description_hi;
    navigate('/', { state: { prefillQuery: query, lang } });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedState('All States');
    setIncomeLevel('all');
    setBplOnly(false);
    setSortBy('name');
  };

  return (
    <div className="all-schemes-page">
      {/* Header */}
      <header className="all-schemes-header">
        <div className="all-schemes-header-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← {lang === 'hi' ? 'वापस' : 'Back'}
          </button>
          <h1 className="all-schemes-title">
            {lang === 'hi' ? 'सभी सरकारी स्वास्थ्य योजनाएं' : 'All Government Health Schemes'}
          </h1>
          <p className="all-schemes-subtitle">
            {lang === 'hi' 
              ? 'भारत सरकार की सभी स्वास्थ्य योजनाओं का अवलोकन और विवरण'
              : 'Overview and details of all Government of India health schemes'
            }
          </p>
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`lang-btn ${lang === 'hi' ? 'lang-btn--active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className="schemes-filters">
        <div className="filters-container">
          <div className="filters-header">
            <h2>{lang === 'hi' ? 'फ़िल्टर' : 'Filters'}</h2>
            <button className="clear-filters-btn" onClick={clearFilters}>
              {lang === 'hi' ? 'सभी फ़िल्टर हटाएं' : 'Clear All'}
            </button>
          </div>

          <div className="filters-grid">
            {/* Search */}
            <div className="filter-group">
              <label>{lang === 'hi' ? 'खोजें' : 'Search'}</label>
              <input
                type="text"
                placeholder={lang === 'hi' ? 'योजना नाम या विवरण खोजें...' : 'Search scheme name or description...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Condition Filter */}
            <div className="filter-group">
              <label>{lang === 'hi' ? 'स्वास्थ्य स्थिति' : 'Health Condition'}</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="filter-select"
              >
                {CONDITIONS.map(condition => (
                  <option key={condition.id} value={condition.id}>
                    {lang === 'en' ? condition.name_en : condition.name_hi}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div className="filter-group">
              <label>{lang === 'hi' ? 'राज्य' : 'State'}</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="filter-select"
              >
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Income Level Filter */}
            <div className="filter-group">
              <label>{lang === 'hi' ? 'आय स्तर' : 'Income Level'}</label>
              <select
                value={incomeLevel}
                onChange={(e) => setIncomeLevel(e.target.value)}
                className="filter-select"
              >
                <option value="all">{lang === 'hi' ? 'सभी आय स्तर' : 'All Income Levels'}</option>
                <option value="bpl">{lang === 'hi' ? 'केवल बीपीएल' : 'BPL Only'}</option>
                <option value="low_income">{lang === 'hi' ? 'कम आय (≤1.5 लाख)' : 'Low Income (≤1.5L)'}</option>
                <option value="middle_income">{lang === 'hi' ? 'मध्यम आय (≤5 लाख)' : 'Middle Income (≤5L)'}</option>
              </select>
            </div>

            {/* BPL Toggle */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={bplOnly}
                  onChange={(e) => setBplOnly(e.target.checked)}
                />
                <span>{lang === 'hi' ? 'बीपीएल की आवश्यकता नहीं' : 'No BPL Required'}</span>
              </label>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label>{lang === 'hi' ? 'छांटें' : 'Sort By'}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">{lang === 'hi' ? 'नाम' : 'Name'}</option>
                <option value="income">{lang === 'hi' ? 'आय सीमा' : 'Income Limit'}</option>
                <option value="documents">{lang === 'hi' ? 'दस्तावेज़' : 'Documents'}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="schemes-results">
        <div className="results-container">
          <div className="results-header">
            <h2>
              {filteredSchemes.length} {lang === 'hi' ? 'योजनाएं मिलीं' : 'schemes found'}
            </h2>
          </div>

          {filteredSchemes.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>{lang === 'hi' ? 'कोई योजना नहीं मिली' : 'No schemes found'}</h3>
              <p>{lang === 'hi' ? 'कृपया अपने फ़िल्टर समायोजित करें' : 'Please adjust your filters'}</p>
            </div>
          ) : (
            <div className="schemes-grid">
              {filteredSchemes.map((scheme) => (
                <div key={scheme.id} className="scheme-card">
                  <div className="scheme-card-header">
                    <h3 className="scheme-card-title">
                      {lang === 'en' ? scheme.name_en : scheme.name_hi}
                    </h3>
                    <div className="scheme-card-badges">
                      {scheme.bpl_required && (
                        <span className="scheme-badge bpl">
                          {lang === 'hi' ? 'बीपीएल' : 'BPL'}
                        </span>
                      )}
                      {scheme.income_limit && (
                        <span className="scheme-badge income">
                          ₹{scheme.income_limit.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="scheme-card-description">
                    {lang === 'en' ? scheme.description_en : scheme.description_hi}
                  </p>

                  <div className="scheme-card-details">
                    <div className="scheme-detail-item">
                      <span className="detail-label">
                        📋 {lang === 'hi' ? 'दस्तावेज़' : 'Documents'}:
                      </span>
                      <span className="detail-value">{scheme.documents.length}</span>
                    </div>
                    
                    <div className="scheme-detail-item">
                      <span className="detail-label">
                        📍 {lang === 'hi' ? 'आवेदन' : 'Apply'}:
                      </span>
                      <span className="detail-value">{scheme.apply_at.split(',')[0]}</span>
                    </div>

                    {scheme.condition && scheme.condition.length > 0 && (
                      <div className="scheme-detail-item">
                        <span className="detail-label">
                          🏥 {lang === 'hi' ? 'स्थितियां' : 'Conditions'}:
                        </span>
                        <span className="detail-value">{scheme.condition.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="scheme-card-actions">
                    <button 
                      className="scheme-btn primary"
                      onClick={() => handleSchemeClick(scheme)}
                    >
                      {lang === 'hi' ? 'विवरण देखें' : 'View Details'}
                    </button>
                    <button className="scheme-btn secondary">
                      {lang === 'hi' ? 'अधिक जानकारी' : 'More Info'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
