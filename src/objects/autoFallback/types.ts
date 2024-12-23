export interface StateEntry {
  fallbackValue: string | null;
  isAutomated: boolean | null;
}

export type State = Record<string, StateEntry>;
