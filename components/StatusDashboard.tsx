import React from 'react';
import type { ProcessStatus, A11yIssue, A11yIssueSeverity } from '../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, StatusOnlineIcon, ExclamationIcon, TagIcon } from './Icons';

interface StatusDashboardProps {
  status: ProcessStatus;
  currentTask: string;
  issues: A11yIssue[];
  onClearIssues: () => void;
}

const statusConfig = {
  IDLE: { icon: <ClockIcon className="h-8 w-8 text-gray-500" />, title: 'Idle', color: 'text-gray-400' },
  TRANSLATING: { icon: <div className="h-8 w-8 text-blue-400 animate-pulse"><StatusOnlineIcon /></div>, title: 'In Progress: Translating', color: 'text-blue-400' },
  CHECKING_COMPLIANCE: { icon: <div className="h-8 w-8 text-purple-400 animate-pulse"><StatusOnlineIcon /></div>, title: 'In Progress: Compliance Check', color: 'text-purple-400' },
  PERSISTING: { icon: <div className="h-8 w-8 text-yellow-400 animate-pulse"><StatusOnlineIcon /></div>, title: 'In Progress: Persisting', color: 'text-yellow-400' },
  COMPLETED: { icon: <CheckCircleIcon className="h-8 w-8 text-green-400" />, title: 'Completed', color: 'text-green-400' },
  ERROR: { icon: <XCircleIcon className="h-8 w-8 text-red-400" />, title: 'Error', color: 'text-red-400' },
};

const severityConfig: Record<A11yIssueSeverity, { iconColor: string, bgColor: string, textColor: string }> = {
  Critical: { iconColor: 'text-red-400', bgColor: 'bg-red-500/10', textColor: 'text-red-300' },
  High: { iconColor: 'text-orange-400', bgColor: 'bg-orange-500/10', textColor: 'text-orange-300' },
  Medium: { iconColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-300' },
  Low: { iconColor: 'text-blue-400', bgColor: 'bg-blue-500/10', textColor: 'text-blue-300' },
};

const StatusDashboard: React.FC<StatusDashboardProps> = ({ status, currentTask, issues, onClearIssues }) => {
  const { icon, title, color } = statusConfig[status];
  const issueCount = issues.length;

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Pipeline Status</h2>
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className={`text-lg font-bold ${color}`}>{title}</p>
          <p className="text-sm text-gray-300">{currentTask}</p>
        </div>
      </div>
      
      {(status === 'COMPLETED' || status === 'ERROR') && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h3 className="font-semibold text-gray-200">Summary</h3>
          <p className="text-gray-400 mt-2">
            {status === 'COMPLETED' ? `Process finished with ${issueCount} issues identified.` : 'The process failed. See console for details.'}
          </p>
        </div>
      )}

      {status === 'COMPLETED' && issueCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-200">Identified Issues</h3>
              <p className="text-sm text-gray-400">Action Required: Add these cards to the Vibe Kanban board.</p>
            </div>
            <button onClick={onClearIssues} className="text-sm bg-gray-700 hover:bg-red-500/50 text-gray-300 hover:text-white px-3 py-1 rounded-md transition-colors">
              Clear Issues
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {issues.map(issue => {
              const { iconColor, bgColor, textColor } = severityConfig[issue.severity];
              return (
                <div key={issue.id} className={`p-4 rounded-lg border border-gray-600/50 ${bgColor}`}>
                  <div className="flex items-start gap-3">
                    <ExclamationIcon className={`h-5 w-5 mt-0.5 shrink-0 ${iconColor}`} />
                    <div>
                      <h4 className="font-semibold text-white">{issue.title}</h4>
                      <p className="text-sm text-gray-300 mt-1">{issue.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <span className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full ${textColor} ${bgColor}`}>
                          <ExclamationIcon className="h-3 w-3" />
                          {issue.severity}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-cyan-300 bg-cyan-500/10 font-medium px-2 py-0.5 rounded-full">
                          <TagIcon className="h-3 w-3" />
                          {issue.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDashboard;