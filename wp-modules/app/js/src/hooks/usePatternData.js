/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../globals';
import assembleUrl from '../utils/assembleUrl';

import useSnackbarContext from './useSnackbarContext';

/**
 * @param {string}                                           patternId
 * @param {typeof import('../globals').fsestudio.patterns}   patterns
 * @param {ReturnType<import('./useThemeJsonFile').default>} currentThemeJsonFile
 * @param {ReturnType<import('./useThemeData').default>}     currentTheme
 */
export default function usePatternData(
	patternId,
	patterns,
	currentThemeJsonFile,
	currentTheme
) {
	const snackBar = useSnackbarContext();
	const [ creatingNewPattern, setCreatingNewPattern ] = useState( false );
	const [ fetchInProgress, setFetchInProgress ] = useState( false );

	/** @type {[import('../components/PatternPicker').Pattern, React.Dispatch<React.SetStateAction<import('../components/PatternPicker').Pattern>>]} */
	const [ patternData, setPatternData ] = useState();

	useEffect( () => {
		// If the patternId passed in changes, get the new pattern data related to it.
		getPatternData();
	}, [] );

	useEffect( () => {
		if ( creatingNewPattern ) {
			savePatternData();
		}

		if ( patternData?.name ) {
			// Hoist the current pattern data up to the object containing all patterns.
			patterns.setPatterns( {
				...patterns.patterns,
				[ patternData.name ]: patternData,
			} );
		}
	}, [ patternData ] );

	function getPatternData() {
		return new Promise( ( resolve ) => {
			if ( ! patternId || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );

			fetch(
				// @ts-ignore fetch allows a string argument.
				assembleUrl( fsestudio.apiEndpoints.getPatternEndpoint, {
					patternId,
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
					if (
						response.error &&
						'pattern-not-found' === response.error
					) {
						setCreatingNewPattern( true );
						// Get pattern data from the current patterns array, and set it for this pattern.
						setPatternData( patterns.patterns[ patternId ] );
					} else {
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
					'X-WP-Nonce': fsestudio.apiNonce,
				},
				body: JSON.stringify( patternData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					if ( creatingNewPattern ) {
						setCreatingNewPattern( false );
						setPatternData( data.patternData );
					} else {
						// Whenever the user saved a pattern, save their theme as well, just in case this pattern is part of this theme.
						currentTheme.save();
						// Get the updated themejson file, which includes global styled CSS for all patterns.
						currentThemeJsonFile.get();
						// We only show the snackbar message if save initiated after initial creation.
						snackBar.setValue( data.message );
					}
					resolve( data );
				} );
		} );
	}

	return {
		data: patternData,
		get: getPatternData,
		set: setPatternData,
		save: savePatternData,
	};
}
