
import React from 'react';
import { VibeKanbanIcon, ExternalLinkIcon } from './Icons';

const KanbanBoard: React.FC = () => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <VibeKanbanIcon className="h-7 w-7 text-cyan-400" />
          <a href="http://127.0.0.1:51515/projects/0d051836-b5ba-4eb8-841c-9798b559a848/tasks" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-semibold text-white hover:text-cyan-400 transition-colors">
            Vibe Kanban Board
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="flex-grow rounded-lg overflow-hidden border border-gray-700">
         <iframe
            src="http://127.0.0.1:51515/projects/0d051836-b5ba-4eb8-841c-9798b559a848/tasks"
            title="Vibe Kanban Board"
            className="w-full h-full border-0"
         />
      </div>
    </div>
  );
};

export default KanbanBoard;
