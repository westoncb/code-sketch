export type ContextItem = {
  name: string
  content: string
}

export enum ResultPanel {
  review = 'review',
  code = 'code',
  waiting = 'waiting'
}

export type MiniStatusConfig = {
  showSpinner?: boolean;
  message?: string;
  onConfirm?: null | (() => void);
  displayRegion?: 'left' | 'right' | 'center';
} | null;
