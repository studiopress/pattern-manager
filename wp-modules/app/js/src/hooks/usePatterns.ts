import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
import removePattern from '../utils/removePattern';
import type { Pattern, Patterns } from '../types';

export default function usePatterns( initialPatterns: Patterns ) {
	const [ patternsData, setPatternsData ] = useState( initialPatterns );

	function deletePattern( patternFileName: Pattern[ 'filename' ] ) {
		setPatternsData( removePattern( patternFileName, patternsData ) );
		return fetch( patternManager.apiEndpoints.deletePatternEndpoint, {
			method: 'DELETE',
			headers: getHeaders(),
			body: JSON.stringify( { patternFileName } ),
		} );
	}

	return {
		data: patternsData,
		deletePattern,
	};
}
