import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

interface VoiceSearchButtonProps {
  onResult: (text: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({ onResult }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const suggestionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Helper to get history key for current language
  const getHistoryKey = () => `searchHistory_${i18n.language}`;

  // Load search history for the current language
  useEffect(() => {
    const stored = localStorage.getItem(getHistoryKey());
    setHistory(stored ? JSON.parse(stored) : []);
  }, [i18n.language]);

  // Save to history
  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter((item) => item !== query)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem(getHistoryKey(), JSON.stringify(newHistory));
  };

  // Clear history for current language
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(getHistoryKey());
  };

  // Define searchable content with translations
  const searchableContent = [
    { path: '/', text: t('nav.home') },
    { path: '/about', text: t('nav.about') },
    { path: '/programs', text: t('nav.programs') },
    { path: '/resources', text: t('nav.resources') },
    { path: '/blog', text: t('nav.blog') },
    { path: '/contact', text: t('nav.contact') },
    { path: '/login', text: t('nav.login') },
    { path: '/signup', text: t('nav.signup') },
    { path: '/profile', text: t('nav.profile') },
    { path: '/settings', text: t('nav.settings') },
    { path: '/admin', text: t('nav.adminDashboard') },
    { path: '/mentorDashboard', text: t('nav.mentorDashboard') },
    { path: '/success-stories', text: t('nav.stories') },
    { path: '/programs/mentorship', text: t('nav.mentorship') },
    { path: '/programs/communication', text: t('nav.communication') },
    { path: '/programs/tech-skills', text: t('nav.techSkills') },
    { path: '/resources/workshops', text: t('nav.workshops') },
    { path: '/resources/community', text: t('nav.community') },
    { path: '/resources/learning', text: t('nav.learning') },
    { path: '/resources/faq', text: t('nav.faq') },
    { path: '/privacy', text: t('nav.privacy') },
    { path: '/terms', text: t('nav.terms') }
  ];

  // Function to handle suggestions timeout
  const handleSuggestionsTimeout = () => {
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }
    suggestionsTimeoutRef.current = setTimeout(() => {
      setSuggestions([]);
      setTranscript('');
      setIsListening(false); // Stop listening after timeout
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, 5000); // 5 seconds
  };

  // Initialize recognition instance once
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError(t('errors.unsupported'));
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t('errors.unsupported'));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Changed to false to stop after one result
    recognition.interimResults = true;
    recognition.lang = i18n.language === 'rw' ? 'rw-RW' : 'en-US';
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    // Event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(transcript);
      // Robust normalization and fuzzy matching for all search items
      const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();
      const normTranscript = normalize(transcript);
      console.log('Transcript:', transcript);
      console.log('Normalized Transcript:', normTranscript);
      const matches = searchableContent.filter((item) =>
        normalize(item.text).includes(normTranscript) || normTranscript.includes(normalize(item.text))
      );
      console.log('Matches:', matches);
      setSuggestions(matches.map((item) => item.text));
      handleSuggestionsTimeout(); // Start the timeout when suggestions are set

      if (event.results[0].isFinal) {
        onResult(transcript);
        addToHistory(transcript);
        // Try matching the last 1, 2, or 3 words as a phrase
        const words = transcript.split(/\s+/).filter(Boolean);
        let match = null;
        for (let n = 1; n <= 3 && n <= words.length; n++) {
          const phrase = words.slice(-n).join(' ');
          const normPhrase = normalize(phrase);
          console.log('Trying phrase:', phrase, 'Normalized:', normPhrase);
          match = searchableContent.find((item) =>
            normalize(item.text) === normPhrase ||
            normalize(item.text).includes(normPhrase) ||
            normPhrase.includes(normalize(item.text))
          );
          if (match) {
            console.log('Match found for phrase:', phrase, 'Match:', match);
            break;
          }
        }
        // If still no match, fall back to previous logic (single words, backwards)
        if (!match) {
          for (const word of words.slice().reverse()) {
            const normWord = normalize(word);
            console.log('Trying word:', word, 'Normalized:', normWord);
            match = searchableContent.find((item) =>
              normalize(item.text) === normWord ||
              normalize(item.text).includes(normWord) ||
              normWord.includes(normalize(item.text))
            );
            if (match) {
              console.log('Match found for word:', word, 'Match:', match);
              break;
            }
          }
        }
        console.log('Final Match:', match);
        if (match) {
          navigate(match.path);
          // Clear everything after navigation
          setSuggestions([]);
          setTranscript('');
          setIsListening(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }
      }
    };
    recognition.onerror = (event: SpeechRecognitionEvent) => {
      setError(t(`errors.${event.error}`));
      setIsListening(false);
      setSuggestions([]);
      setTranscript('');
    };
    recognition.onend = () => {
      setIsListening(false);
      setSuggestions([]);
      setTranscript('');
    };

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognitionRef.current = null;
    };
  }, [i18n.language, t]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = i18n.language === 'rw' ? 'rw-RW' : 'en-US';
    }
  }, [i18n.language]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setError(null);
      setSuggestions([]); // Clear any existing suggestions
      setTranscript(''); // Clear any existing transcript
      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
      }
    } catch {
      setError(t('errors.microphonePermission'));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
    setSuggestions([]);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-1.5 rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-200'} hover:bg-gray-300 transition-colors`}
        aria-label={isListening ? t('search.listening') : t('search.voiceSearch')}
      >
        <img
          src={assets.voiceicon}
          alt={isListening ? t('search.listening') : t('search.voiceSearch')}
          className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`}
        />
      </button>

      {isListening && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-lg w-64 z-50">
          <div className="text-sm font-medium mb-2">{t('search.suggestions')}</div>
          {transcript && (
            <div className="text-sm text-gray-600 mb-2">
              {transcript}
            </div>
          )}
          {suggestions.length > 0 && (
            <ul className="text-sm">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="py-1 hover:bg-gray-100 cursor-pointer">
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {/* Show search history for this language if no suggestions */}
          {suggestions.length === 0 && history.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-400">{t('search.history')}</div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-blue-500 hover:underline ml-2"
                  type="button"
                >
                  {t('search.clearHistory')}
                </button>
              </div>
              <ul className="text-xs">
                {history.map((item, idx) => (
                  <li key={idx} className="py-1 hover:bg-gray-100 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceSearchButton;
