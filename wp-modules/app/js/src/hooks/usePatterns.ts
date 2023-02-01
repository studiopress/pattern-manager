import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
import type { Pattern, Patterns } from '../types';

export default function usePatterns( initialPatterns: Patterns ) {
	const [ patternsData, setPatternsData ] = useState( initialPatterns );

	const refs = useRef< { [ key: string ]: HTMLIFrameElement } >( {} );

	const addRef = ( key: string, newRef: HTMLIFrameElement ) => {
		refs.current[ key ] = newRef;
	};
	const reloadPatternPreviews = () => {
		Object.values( refs.current ).forEach( ( ref ) => {
			ref?.contentWindow?.location.reload();
		} );
	};

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
		} )
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw response.statusText;
				}
				return response.json();
			} )
			.then( ( data: { patterns: Patterns } ) => {
				setPatternsData( data.patterns );
				reloadPatternPreviews();
			} );
	}

	return {
		addRef,
		data: patternsData,
		savePattern,
		savePatterns,
		set: setPatternsData,
	};
}
