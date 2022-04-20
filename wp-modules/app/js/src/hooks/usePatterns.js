/* global fetch */
// @ts-check

import * as React from 'react';
import { useState } from '@wordpress/element';
import { fsestudio } from '../globals';

/** @param {typeof import('../').fsestudio.patterns} initialPatterns */
export default function usePatterns( initialPatterns ) {
	/** @type {[typeof import('../').fsestudio.patterns, React.Dispatch<React.SetStateAction<typeof import('../').fsestudio.patterns>>]} */
	const [ patterns, setPatterns ] = useState( initialPatterns );

	function createNewPattern( patternData ) {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.savePatternEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': fsestudio.apiNonce,
				},
				body: JSON.stringify( patternData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					resolve( data );
				} );
		} );
	}

	return {
		patterns,
		setPatterns,
		createNewPattern,
	};
}
