import React from 'react';

export default function VoiceButton({ listening, supported, onStart, onStop, lang }) {
  if (!supported) return null;

  return (
    <button
      type="button"
      className={`voice-btn ${listening ? 'voice-btn--active' : ''}`}
      onClick={listening ? onStop : onStart}
      title={
        listening
          ? (lang === 'hi' ? 'रोकें' : 'Stop recording')
          : (lang === 'hi' ? 'बोलें' : 'Speak your problem')
      }
      aria-label={listening ? 'Stop voice input' : 'Start voice input'}
    >
      {listening ? (
        <>
          <span className="voice-btn__ripple" />
          <span className="voice-btn__icon">🛑</span>
        </>
      ) : (
        <span className="voice-btn__icon">🎙️</span>
      )}
    </button>
  );
}
