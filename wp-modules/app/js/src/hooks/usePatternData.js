/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../';
import assembleUrl from '../utils/assembleUrl';

import useSnackbarContext from './useSnackbarContext';

/**
 * @param {string}                                           patternId
 * @param {module:Main.InitialFseStudio.patterns}            patterns
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
	const [ fetchInProgress, setFetchInProgress ] = useState( false );

	/** @type {[import('../components/PatternPicker').Pattern, React.Dispatch<React.SetStateAction<import('../components/PatternPicker').Pattern>>]} */
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
				// @ts-ignore fetch allows a string argument.
				assembleUrl( fsestudio.apiEndpoints.getPatternEndpoint, {
					patternId: thisPatternId,
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
					'X-WP-Nonce': fsestudio.apiNonce,
				},
				body: JSON.stringify( patternData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					currentTheme.save();
					currentThemeJsonFile.get();
					snackBar.setValue( JSON.stringify( data ));
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
