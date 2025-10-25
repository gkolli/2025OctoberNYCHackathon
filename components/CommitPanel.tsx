
import React from 'react';
import type { ProcessStatus } from '../types';
import { GitHubIcon } from './Icons';

interface CommitPanelProps {
  onStart: () => void;
  status: ProcessStatus;
}

const CommitPanel: React.FC<CommitPanelProps> = ({ onStart, status }) => {
  const isLoading = status !== 'IDLE' && status !== 'COMPLETED' && status !== 'ERROR';
  
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <GitHubIcon className="h-8 w-8 text-gray-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">GitHub Repository</h2>
          <p className="text-sm text-gray-400">main @ <span className="font-mono">a3d4e8f</span></p>
        </div>
      </div>
      <p className="text-gray-300 mb-6">
        A new commit has been detected. Start the autonomous pipeline to check for localization and accessibility issues.
      </p>
      <button
        onClick={onStart}
        disabled={isLoading}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : 'Start Compliance Pipeline'}
      </button>
    </div>
  );
};

export default CommitPanel;
