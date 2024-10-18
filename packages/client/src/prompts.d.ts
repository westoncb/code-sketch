import { ContextItem } from "./client-types";
export declare const genCodePrompt: (sketch: string, contextItems: ContextItem[]) => string;
export declare const genReviewPrompt: (sketch: string, contextItems: ContextItem[]) => string;
export declare const getRefineSketchPrompt: (reconstructedSketch: string) => string;
