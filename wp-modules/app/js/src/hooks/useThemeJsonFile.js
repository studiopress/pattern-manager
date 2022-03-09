/* global fetch */
// @ts-check

import { useState, useEffect } from '@wordpress/element';

// Utils
import { assembleUrl } from './../utils/assembleUrl';

const fsestudio = /** @type {import('../').InitialFseStudio} */ ( window.fsestudio );

/** @param {string} id */
export function useThemeJsonFile( id ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ themeJsonData, setThemeJsonData ] = useState();
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
				assembleUrl( fsestudio.apiEndpoints.getThemeJsonFileEndpoint, {
					filename: id,
				} ),
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
			)
				.then( ( response ) => response.json() )
				.then( ( response ) => {
					setFetchInProgress( false );
					setThemeJsonData( response );
					resolve( response );
				} );
		} );
	}

	function saveThemeJsonData() {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.saveThemeJsonFileEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
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
