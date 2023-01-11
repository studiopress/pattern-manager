import type { InitialPatternManager } from '../types';
export const { patternmanager } = window as typeof window & {
	patternmanager: InitialPatternManager;
};
