/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../globals';
import assembleUrl from '../utils/assembleUrl';

/**
 * @typedef {{
 *  name: string,
 *  content: string,
 *  renderedGlobalStyles: Record<string, unknown>,
 *  patternPreviewParts: import('./useThemeData').PatternPreviewParts
 * }} ThemeData
 */

/** @param {string} id */
export default function useThemeJsonFile( id ) {
	/** @type {[ThemeData, React.Dispatch<React.SetStateAction<ThemeData>>]} */
	const [ themeJsonData, setThemeJsonData ] = useState();
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ hasSaved, setHasSaved ] = useState( false );

	useEffect( () => {
		setHasSaved( false );
	}, [ themeJsonData ] );

	useEffect( () => {
		// If the id passed in changes, get the new themeJson data related to it.
		getThemeJsonData();
	}, [ id ] );

	function getThemeJsonData() {
		return new Promise( ( resolve ) => {
			if ( ! id || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch(
				// @ts-ignore fetch allows a string argument.
				assembleUrl( fsestudio.apiEndpoints.getThemeJsonFileEndpoint, {
					filename: id,
				} ),
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'X-WP-Nonce': fsestudio.apiNonce,
					},
				}
			)
				.then( ( response ) => response.json() )
				.then( ( response ) => {
					setFetchInProgress( false );
					setThemeJsonData( response );
					resolve( response );
				} )
		} );
	}

	function saveThemeJsonData() {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.saveThemeJsonFileEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': fsestudio.apiNonce,
				},
				body: JSON.stringify( themeJsonData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					getThemeJsonData();
					setHasSaved( true );
					resolve( data );
				} );
		} );
	}

	return {
		data: themeJsonData,
		get: getThemeJsonData,
		set: setThemeJsonData,
		save: saveThemeJsonData,
		hasSaved,
	};
}
