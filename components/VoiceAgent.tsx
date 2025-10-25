import React, { useState, useEffect, useRef } from 'react';
import type { ProcessStatus } from '../types';
import { MicrophoneIcon } from './Icons';

// FIX: Add TypeScript definitions for the experimental Web Speech API to resolve compilation errors.
// This API is not part of the standard DOM typings.
interface SpeechRecognition {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceAgentProps {
  onCommand: () => void;
  status: ProcessStatus;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ onCommand, status }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Voice command received:', command);

      if (command.includes("start analysis") || command.includes("run pipeline")) {
        onCommand();
      }
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const isProcessing = status !== 'IDLE' && status !== 'COMPLETED' && status !== 'ERROR';

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Voice Agent</h2>
      <p className="text-gray-300 mb-6">
        Use voice commands to control the pipeline. Try saying: <strong className="text-cyan-400">"Start analysis"</strong>.
      </p>
      <div className="flex items-center justify-center">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`relative h-20 w-20 rounded-full transition-all duration-300 flex items-center justify-center
            ${isListening ? 'bg-red-500 animate-pulse' : 'bg-cyan-500 hover:bg-cyan-600'}
            disabled:bg-gray-600 disabled:cursor-not-allowed`}
        >
          <MicrophoneIcon className="h-8 w-8 text-white" />
        </button>
      </div>
      <p className="text-center mt-4 text-sm text-gray-400">
        Status: {isListening ? 'Listening...' : 'Ready'}
      </p>
    </div>
  );
};

export default VoiceAgent;
