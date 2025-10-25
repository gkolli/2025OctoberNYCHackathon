
export type ProcessStatus = 'IDLE' | 'TRANSLATING' | 'CHECKING_COMPLIANCE' | 'PERSISTING' | 'COMPLETED' | 'ERROR';

export type KanbanStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type A11yIssueType = 'Accessibility' | 'Localization';

export type A11yIssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface A11yIssue {
  id: string;
  title: string;
  description: string;
  severity: A11yIssueSeverity;
  type: A11yIssueType;
  status: KanbanStatus;
}

export interface GeminiA11yIssue {
  title: string;
  description: string;
  severity: A11yIssueSeverity;
  type: A11yIssueType;
}
