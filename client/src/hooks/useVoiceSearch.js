import { useState, useEffect, useRef } from 'react';

export function useVoiceSearch(lang = 'en') {
  const [listening,  setListening]  = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported,  setSupported]  = useState(false);
  const [error,      setError]      = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous     = false;
      rec.interimResults = true;
      rec.lang           = lang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onresult = (e) => {
        const text = Array.from(e.results)
          .map(r => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      rec.onerror = (e) => {
        setError(
          e.error === 'not-allowed'
            ? 'Microphone access denied. Please allow microphone in browser settings.'
            : `Voice error: ${e.error}`
        );
        setListening(false);
      };

      rec.onend = () => setListening(false);

      recognitionRef.current = rec;
    }
  }, [lang]);

  function startListening() {
    if (!recognitionRef.current) return;
    setError('');
    setTranscript('');
    recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setError('Could not start microphone. Try again.');
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  return { listening, transcript, supported, error, startListening, stopListening };
}
