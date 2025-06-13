import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

interface VoiceSearchProps {
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
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SearchSuggestion {
  text: string;
  path: string;
  category: string;
  description?: string;
}

const VoiceSearchButton = ({ onResult }: VoiceSearchProps) => {
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const lastNavigationRef = useRef<string>("");

  // Comprehensive searchable content with categories and descriptions
  const searchableContent: SearchSuggestion[] = [
    // Main Pages
    { text: "home", path: "/", category: "Main Pages", description: "Go to homepage" },
    { text: "about", path: "/about", category: "Main Pages", description: "Learn about EmpowerHer" },
    { text: "contact", path: "/contact", category: "Main Pages", description: "Get in touch with us" },
    { text: "success stories", path: "/success-stories", category: "Main Pages", description: "Read success stories" },
    
    // Programs
    { text: "mentorship", path: "/programs/mentorship", category: "Programs", description: "Join our mentorship program" },
    { text: "communication", path: "/programs/Communication", category: "Programs", description: "Leadership and communication training" },
    { text: "tech skills", path: "/programs/tech-skills", category: "Programs", description: "Learn technical skills" },
    { text: "workshops", path: "/programs/workshops", category: "Programs", description: "Attend our workshops" },
    
    // Resources
    { text: "blog", path: "/blog", category: "Resources", description: "Read our latest articles" },
    { text: "community", path: "/resources/community", category: "Resources", description: "Join our community" },
    { text: "learning", path: "/resources/learning", category: "Resources", description: "Access learning resources" },
    
    // Authentication
    { text: "login", path: "/login", category: "Account", description: "Sign in to your account" },
    { text: "sign up", path: "/signup", category: "Account", description: "Create a new account" },
    { text: "profile", path: "/profile", category: "Account", description: "View your profile" },
    { text: "settings", path: "/settings", category: "Account", description: "Manage your settings" },
    
    // Additional Content
    { text: "leadership", path: "/programs/Communication", category: "Programs", description: "Leadership development program" },
    { text: "training", path: "/programs/tech-skills", category: "Programs", description: "Technical training programs" },
    { text: "events", path: "/programs/workshops", category: "Programs", description: "Upcoming events and workshops" },
    { text: "support", path: "/contact", category: "Support", description: "Get help and support" },
    { text: "faq", path: "/faq", category: "Support", description: "Frequently asked questions" },
    { text: "privacy", path: "/privacy", category: "Legal", description: "Privacy policy" },
    { text: "terms", path: "/terms", category: "Legal", description: "Terms of service" }
  ];

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearTranscripts = () => {
    setInterimTranscript("");
    setFinalTranscript("");
    setSuggestions([]);
  };

  const findMatchingSuggestions = (text: string): SearchSuggestion[] => {
    const searchText = text.toLowerCase().trim();
    const words = searchText.split(/\s+/);
    
    return searchableContent.filter(item => {
      const itemText = item.text.toLowerCase();
      const itemDesc = item.description?.toLowerCase() || "";
      const itemCategory = item.category.toLowerCase();
      
      // Check for exact matches first
      if (itemText === searchText || itemDesc === searchText) {
        return true;
      }
      
      // Check if any word matches exactly
      if (words.some(word => itemText === word || itemDesc === word)) {
        return true;
      }
      
      // Check for partial matches
      return words.some(word => 
        itemText.includes(word) || 
        itemDesc.includes(word) || 
        itemCategory.includes(word)
      );
    });
  };

  const handleNavigation = (suggestion: SearchSuggestion) => {
    // Prevent duplicate navigation to the same path
    if (lastNavigationRef.current === suggestion.path) {
      return;
    }
    
    lastNavigationRef.current = suggestion.path;
    navigate(suggestion.path);
    clearTranscripts();
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);
      return false;
    }
  };

  const startVoiceSearch = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setPermissionError("Microphone access was denied. Please allow microphone access in your browser settings.");
      alert("Microphone access is required for voice search. Please allow microphone access in your browser settings.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.continuous = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            // Get alternative transcripts for better matching
            const alternatives = Array.from(event.results[i]).slice(1).map(alt => alt.transcript);
            onResult(finalTranscript + " " + alternatives.join(" "));
            
            // Find matching suggestions
            const matches = findMatchingSuggestions(finalTranscript);
            setSuggestions(matches);
            
            // If we have a single exact match, navigate immediately
            if (matches.length === 1) {
              handleNavigation(matches[0]);
            }
            // If we have multiple matches, show them but don't navigate automatically
            else if (matches.length > 1) {
              setSuggestions(matches);
            }
          } else {
            interimTranscript += transcript;
            // Show suggestions for interim results
            const matches = findMatchingSuggestions(interimTranscript);
            setSuggestions(matches);
          }
        }

        setInterimTranscript(interimTranscript);
        if (finalTranscript) {
          setFinalTranscript(finalTranscript);
          // Clear transcripts after 5 seconds
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = window.setTimeout(clearTranscripts, 5000);
        }
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        console.error("Voice search error:", event.error);
        setIsListening(false);
        
        switch (event.error) {
          case "not-allowed":
          case "permission-denied":
            setPermissionError("Microphone access was denied. Please allow microphone access in your browser settings.");
            alert("Microphone access is required for voice search. Please allow microphone access in your browser settings.");
            break;
          case "no-speech":
            alert("No speech was detected. Please try again.");
            break;
          case "audio-capture":
            alert("No microphone was found. Please ensure your microphone is properly connected.");
            break;
          case "network":
            alert("Network error occurred. Please check your internet connection.");
            break;
          default:
            alert(`Voice search error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        clearTranscripts();
      };

      recognitionRef.current = recognition;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setPermissionError(null);
        clearTranscripts();
        lastNavigationRef.current = ""; // Reset last navigation
      }
    } catch (error) {
      console.error("Failed to start voice recognition:", error);
      setIsListening(false);
      alert("Failed to start voice recognition. Please try again.");
    }
  };

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={startVoiceSearch}
        className={`p-1.5 rounded-full transition-colors duration-200 ${
          isListening ? "bg-red-100" : "hover:bg-gray-100"
        }`}
        aria-label={isListening ? "Stop voice search" : "Start voice search"}
      >
        <img 
          src={assets.voiceicon} 
          className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} 
          alt={isListening ? "Listening..." : "Voice search"} 
        />
      </button>
      {(interimTranscript || finalTranscript || suggestions.length > 0) && (
        <div className="absolute right-0 mt-2 w-80 p-2 bg-white text-gray-700 text-xs rounded shadow-lg transition-opacity duration-300 z-50">
          {interimTranscript && (
            <div className="text-gray-500 italic">
              {interimTranscript}
            </div>
          )}
          {finalTranscript && (
            <div className="text-gray-900 font-medium mt-1">
              {finalTranscript}
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <div className="text-gray-500 mb-1">Suggestions:</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(suggestion)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{suggestion.text}</span>
                    <span className="text-gray-500 text-xs">{suggestion.description}</span>
                    <span className="text-gray-400 text-xs">{suggestion.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {permissionError && (
        <div className="absolute right-0 mt-2 w-64 p-2 bg-red-50 text-red-700 text-xs rounded shadow-lg z-50">
          {permissionError}
        </div>
      )}
    </div>
  );
};

export default VoiceSearchButton;
