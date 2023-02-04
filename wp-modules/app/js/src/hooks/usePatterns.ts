import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
import removePattern from '../utils/removePattern';
import type { Pattern, Patterns } from '../types';

export default function usePatterns( initialPatterns: Patterns ) {
	const [ patternsData, setPatternsData ] = useState( initialPatterns );

	/** Saves a single pattern. */
	async function savePattern( patternToSave: Pattern ) {
		return fetch( patternManager.apiEndpoints.savePatternEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( { pattern: patternToSave } ),
		} );
	}

	/** Deletes a pattern. */
	async function deletePattern( patternName: Pattern[ 'name' ] ) {
		setPatternsData(
			removePattern( patternName, patternsData )
		);
		return fetch( patternManager.apiEndpoints.deletePatternEndpoint, {
			method: 'DELETE',
			headers: getHeaders(),
			body: JSON.stringify( { patternName } ),
		} );
	}

	return {
		data: patternsData,
		deletePattern,
		savePattern,
	};
}
