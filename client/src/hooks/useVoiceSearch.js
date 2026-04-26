import { useState, useEffect, useRef } from 'react';

export function useVoiceSearch(lang = 'en') {
  const [listening,  setListening]  = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported,  setSupported]  = useState(false);
  const [error,      setError]      = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(lang);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous     = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang           = lang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (e) => {
        const result = e.results[e.results.length - 1];
        const text = result[0].transcript;
        const confidence = result[0].confidence;
        
        setTranscript(text);
        
        // Simple language detection based on characters
        const hasHindiChars = /[\u0900-\u097F]/.test(text);
        const hasEnglishChars = /[a-zA-Z]/.test(text);
        
        if (hasHindiChars && !hasEnglishChars) {
          setDetectedLanguage('hi');
        } else if (hasEnglishChars && !hasHindiChars) {
          setDetectedLanguage('en');
        }
        // If mixed, keep current preference
      };

      rec.onerror = (e) => {
        let errorMessage = '';
        switch(e.error) {
          case 'not-allowed':
            errorMessage = '🎤 Microphone access denied. Please allow microphone in browser settings.';
            break;
          case 'no-speech':
            errorMessage = '🎤 No speech detected. Please try speaking clearly.';
            break;
          case 'network':
            errorMessage = '🎤 Network error. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            errorMessage = '🎤 Speech recognition service not allowed. Please try a different browser.';
            break;
          default:
            errorMessage = `🎤 Voice error: ${e.error}`;
        }
        setError(errorMessage);
        setListening(false);
      };

      rec.onstart = () => {
        setError('');
        setListening(true);
      };

      rec.onend = () => {
        setListening(false);
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  function startListening() {
    if (!recognitionRef.current) return;
    
    // Stop any existing recognition
    if (listening) {
      recognitionRef.current.stop();
    }
    
    setError('');
    setTranscript('');
    recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      setError('🎤 Could not start microphone. Please ensure microphone permissions are granted.');
    }
  }

  function stopListening() {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  }

  function clearTranscript() {
    setTranscript('');
    setError('');
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && listening) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [listening]);

  return { 
    listening, 
    transcript, 
    supported, 
    error, 
    detectedLanguage,
    startListening, 
    stopListening, 
    clearTranscript 
  };
}
