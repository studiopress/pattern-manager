import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
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

	/** Saves multiple patterns. */
	async function savePatterns( patternsToSave: Patterns ) {
		return fetch( patternManager.apiEndpoints.savePatternsEndpoint, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify( { patterns: patternsToSave } ),
		} );
	}

	return {
		data: patternsData,
		savePattern,
		savePatterns,
		set: setPatternsData,
	};
}
