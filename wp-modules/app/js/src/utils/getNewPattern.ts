import type { Pattern } from '../types';

export default function getNewPattern( newPattern: Pattern ) {
	const defaultPattern = {
		categories: [],
		keywords: [],
		blockTypes: [],
		postTypes: [],
		inserter: true,
		description: '',
		viewportWidth: '',
		content: '',
	};

	return {
		...defaultPattern,
		...newPattern,
	};
}
