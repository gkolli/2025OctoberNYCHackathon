import React, { useState, useCallback, useEffect } from 'react';
import type { ProcessStatus, A11yIssue } from './types';
import { analyzeCodeForA11y } from './services/geminiService';
import Header from './components/Header';
import CommitPanel from './components/CommitPanel';
import StatusDashboard from './components/StatusDashboard';
import KanbanBoard from './components/KanbanBoard';
import VoiceAgent from './components/VoiceAgent';

// Sample code with intentional i18n and a11y issues for Gemini to analyze
const SAMPLE_CODE = `
<div class="p-4 border rounded-lg">
  <img src="https://picsum.photos/300/150" />
  <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded" style="width: 120px;">
    Submit Application
  </button>
  <p>Please click the button to proceed. This action is final.</p>
</div>
`;

const App: React.FC = () => {
  const [processStatus, setProcessStatus] = useState<ProcessStatus>('IDLE');
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [currentTask, setCurrentTask] = useState<string>('');

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const runPipeline = useCallback(async () => {
    if (processStatus !== 'IDLE' && processStatus !== 'COMPLETED' && processStatus !== 'ERROR') return;

    setIssues([]);
    setProcessStatus('TRANSLATING');
    setCurrentTask('Translating content with DeepL...');
    speak('Starting localization and accessibility analysis.');
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessStatus('CHECKING_COMPLIANCE');
    setCurrentTask('Analyzing for WCAG & L10N compliance...');
    speak('Analyzing for accessibility, WCAG, internationalization, and localization compliance.');

    try {
      const foundIssues = await analyzeCodeForA11y(SAMPLE_CODE);

      const additionalIssue: A11yIssue = {
        id: 'manual-issue-1',
        title: 'Text Not Translated',
        description: 'Please translate your text into German, Japanese, French, and Arabic.',
        severity: 'High',
        type: 'Localization',
        status: 'TODO',
      };

      const allIssues = [...foundIssues, additionalIssue];
      
      setIssues(allIssues);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessStatus('PERSISTING');
      setCurrentTask('Syncing issues with Vibe Kanban...');
      speak(allIssues.length > 0
        ? `Analysis complete. ${allIssues.length} issues found. Solve manually or sync with Vibe Kanban.`
        : 'Analysis complete. No issues found.'
      );
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      setProcessStatus('COMPLETED');
      setCurrentTask('Workflow finished.');

    } catch (error) {
      console.error("Error during pipeline execution:", error);
      setProcessStatus('ERROR');
      setCurrentTask('An error occurred during compliance check.');
      speak('An error occurred. Please check the console for details.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processStatus, speak]);

  const handleClearIssues = () => {
    setIssues([]);
  };

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CommitPanel onStart={runPipeline} status={processStatus} />
          <StatusDashboard 
            status={processStatus} 
            currentTask={currentTask} 
            issues={issues}
            onClearIssues={handleClearIssues}
          />
          <VoiceAgent onCommand={runPipeline} status={processStatus} />
        </div>
        <div className="lg:col-span-2">
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
};

export default App;