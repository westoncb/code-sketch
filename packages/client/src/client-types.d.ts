export type ContextItem = {
    id: string;
    content: string;
};
export declare enum ResultPanel {
    review = "review",
    code = "code",
    waiting = "waiting"
}
export type MiniStatusConfig = {
    showSpinner?: boolean;
    message?: string;
    onConfirm?: null | (() => void);
    displayRegion?: 'left' | 'right' | 'center';
} | null;
