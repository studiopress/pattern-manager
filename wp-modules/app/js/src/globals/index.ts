import type { InitialPatternManager } from '../types';
export const { patternManager } = window as typeof window & {
	patternManager: InitialPatternManager;
};
