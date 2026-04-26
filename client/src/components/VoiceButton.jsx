import React from 'react';

export default function VoiceButton({ 
  listening, 
  supported, 
  onStart, 
  onStop, 
  lang, 
  detectedLanguage,
  transcript,
  error 
}) {
  if (!supported) return null;

  const getButtonText = () => {
    if (listening) {
      return detectedLanguage === 'hi' ? 'रोकें' : 'Stop';
    }
    return lang === 'hi' ? 'बोलें' : 'Speak';
  };

  const getTitle = () => {
    if (listening) {
      return detectedLanguage === 'hi' ? 'रिकॉर्डिंग रोकें' : 'Stop recording';
    }
    if (detectedLanguage && detectedLanguage !== lang) {
      const detectedName = detectedLanguage === 'hi' ? 'Hindi' : 'English';
      const currentName = lang === 'hi' ? 'Hindi' : 'English';
      return `Click to speak in ${currentName} (detected: ${detectedName})`;
    }
    return lang === 'hi' ? 'अपनी समस्या बोलें' : 'Speak your health problem';
  };

  return (
    <div className="voice-input-wrapper">
      <button
        type="button"
        className={`voice-btn ${listening ? 'voice-btn--active' : ''} ${error ? 'voice-btn--error' : ''}`}
        onClick={listening ? onStop : onStart}
        title={getTitle()}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      >
        {listening ? (
          <>
            <span className="voice-btn__ripple" />
            <span className="voice-btn__icon">�</span>
            <span className="voice-btn__text">{getButtonText()}</span>
          </>
        ) : (
          <>
            <span className="voice-btn__icon">🎙️</span>
            <span className="voice-btn__text">{getButtonText()}</span>
          </>
        )}
      </button>
      
      {detectedLanguage && detectedLanguage !== lang && (
        <div className="voice-detected-lang">
          <span className="voice-lang-indicator">
            {detectedLanguage === 'hi' ? '🇮🇳 Hindi' : '🇺🇸 English'} detected
          </span>
        </div>
      )}
      
      {transcript && !listening && (
        <div className="voice-transcript-preview">
          <span className="transcript-text">"{transcript}"</span>
        </div>
      )}
    </div>
  );
}
