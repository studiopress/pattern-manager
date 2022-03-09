/* global fetch */
// @ts-check

import { useState, useEffect } from '@wordpress/element';

// Utils
import { assembleUrl } from '../utils/assembleUrl';

const fsestudio = /** @type {import('../').InitialFseStudio} */ ( window.fsestudio );

/**
 * @param {string}                                  patternId
 * @param {import('../').InitialFseStudio.patterns} patterns
 * @param {import('./useThemeJsonFile').useThemeJsonFile} currentThemeJsonFile
 * @param {import('../').InitialFseStudio.patterns} currentTheme
 */
export function usePatternData(
	patternId,
	patterns,
	currentThemeJsonFile,
	currentTheme
) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ patternData, setPatternData ] = useState();

	useEffect( () => {
		// If the patternId passed in changes, get the new pattern data related to it.
		getPatternData( patternId );
	}, [ patternId ] );

	function getPatternData( thisPatternId ) {
		return new Promise( ( resolve ) => {
			if ( ! thisPatternId || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );

			fetch(
				assembleUrl( fsestudio.apiEndpoints.getPatternEndpoint, {
					patternId: thisPatternId,
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
					if (
						response.error &&
						'pattern-not-found' === response.error
					) {
						// Get pattern data from the current patterns array, and set it for this pattern.
						setPatternData( patterns.patterns[ thisPatternId ] );
					} else {
						setFetchInProgress( false );
						setPatternData( response );
						currentThemeJsonFile.get();
					}
					resolve( response );
				} );
		} );
	}

	function savePatternData() {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.savePatternEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( patternData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					currentTheme.save();
					currentThemeJsonFile.get();
					resolve( data );
				} );
		} );
	}

	return {
		data: patternData,
		set: setPatternData,
		save: savePatternData,
	};
}
