import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
import removePattern from '../utils/removePattern';
import type { Pattern, Patterns } from '../types';

export default function usePatterns( initialPatterns: Patterns ) {
	const [ patternsData, setPatternsData ] = useState( initialPatterns );
	
	async function refreshPatterns() {
		try {
			const response = await fetch(patternManager.apiEndpoints.getPatterns, {
				method: 'GET',
				headers: getHeaders(),
			} );
			if (!response.ok) {
			  throw new Error('Failed to fetch JSON');
			}
			const json = await response.json();
			if ( json?.patterns ) {
				setPatternsData({});
				setPatternsData(json?.patterns);
				return json?.patterns;
			} else {
				throw new Error('Invalid structure returned for patterns.');
			}
		   } catch (error) {
			console.log('An error occurred while fetching patterns:', error);
			return false;
		}
	}

	function deletePattern( patternName: Pattern[ 'name' ] ) {
		setPatternsData( removePattern( patternName, patternsData ) );
		return fetch( patternManager.apiEndpoints.deletePatternEndpoint, {
			method: 'DELETE',
			headers: getHeaders(),
			body: JSON.stringify( { patternName } ),
		} );
	}

	return {
		data: patternsData,
		refreshPatterns,
		deletePattern,
	};
}
