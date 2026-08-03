export interface TimeoutRule {
  pattern: RegExp | string;
  timeout: number; // ms
}

export const TIMEOUT_RULES: TimeoutRule[] = [
  // all metadata requests to any api sould be quick
  { pattern: '/metadata', timeout: 10_000 },
];

export const DEFAULT_TIMEOUT = 600_000;
