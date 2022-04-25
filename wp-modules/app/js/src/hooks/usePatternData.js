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
 * @param {ReturnType<import('./useThemeData').default>}     currentTheme
 */
export default function usePatternData(
	patternId,
	patterns,
	currentTheme
) {
	const snackBar = useSnackbarContext();
	const [ fetchInProgress, setFetchInProgress ] = useState( false );

	/** @type {[import('../components/PatternPicker').Pattern, React.Dispatch<React.SetStateAction<import('../components/PatternPicker').Pattern>>]} */
	const [ patternData, setPatternData ] = useState();

	useEffect( () => {
		console.log( 'Pattern ID Changed', patternId );
		// If the patternId passed in changes, get the new pattern data related to it.
		getPatternData();
	}, [ patternId ] );

	useEffect( () => {
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
						console.log(response.error);
					} else {
						setPatternData( response );
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
					snackBar.setValue( data.message );
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
