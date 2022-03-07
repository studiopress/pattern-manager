import { useState } from '@wordpress/element';

export function usePatterns( initialPatterns ) {
	const [ patterns, setPatterns ] = useState( initialPatterns );

	return {
		patterns,
		setPatterns,
	};
}
