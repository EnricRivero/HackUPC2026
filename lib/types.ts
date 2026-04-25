export type TimelinePointType = "commit" | "push" | "restore";

export type GitActionType = "commit" | "push" | "restore";

export type SavePoint = {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  type: TimelinePointType;
  branch: string;
};

export type RepositoryState = {
  branchName: string;
  commits: SavePoint[];
  workingChanges: string[];
  stagedChanges: number;
  pushedPointId?: string;
  remoteStatus: string;
  lastAction: GitActionType | "idle";
};

export type GitAction = {
  type: GitActionType;
  label: string;
  naturalExplanation: string;
  gitTranslation: string[];
  accent: string;
  previewChanges: string[];
};

export type PendingAction = {
  action: GitAction;
  before: RepositoryState;
  after: RepositoryState;
  summary: string;
  backupLabel: string;
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  kind?: "normal" | "confirmation" | "result" | "transcript" | "fallback";
};
