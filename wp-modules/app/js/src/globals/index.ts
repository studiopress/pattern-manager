/* eslint-disable camelcase */

import type { InitialFseStudio } from '../types';
export const { fsestudio } = window as typeof window & {
	fsestudio: InitialFseStudio;
};
