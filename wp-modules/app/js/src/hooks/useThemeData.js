/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../';
import { assembleUrl } from './../utils/assembleUrl';

/**
 * @param {string}                                                    themeId
 * @param {ReturnType<import('./useThemes').useThemes>}               themes
 * @param {ReturnType<import('./useThemeJsonFile').useThemeJsonFile>} currentThemeJsonFile
 */
export function useThemeData( themeId, themes, currentThemeJsonFile ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ hasSaved, setHasSaved ] = useState( false );

	/**
	 * @typedef {{
	 *  name: string,
	 *  theme_json_file: string
	 * } | {}} ThemeData
	 */
	/** @type {[ThemeData, React.Dispatch<React.SetStateAction<ThemeData>>]} */
	const [ themeData, setThemeData ] = useState( {} );
	const [ existsOnDisk, setExistsOnDisk ] = useState( false );

	useEffect( () => {
		setHasSaved( false );
	}, [ themeData ] );

	useEffect( () => {
		// If the themeId passed in changes, get the new theme data related to it.
		getThemeData( themeId );
	}, [ themeId ] );

	function getThemeData( thisThemeId ) {
		return new Promise( ( resolve ) => {
			if ( ! thisThemeId || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch(
				// @ts-ignore fetch allows a string argument.
				assembleUrl( fsestudio.apiEndpoints.getThemeEndpoint, {
					themeId: thisThemeId,
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
					if (
						response.error &&
						response.error === 'theme_not_found'
					) {
						setThemeData( themes.themes[ thisThemeId ] );
						setExistsOnDisk( false );
					} else {
						setExistsOnDisk( true );
						setThemeData( response );
						resolve( response );
					}
				} );
		} );
	}

	function saveThemeData() {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.saveThemeEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( themeData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					setExistsOnDisk( true );
					setHasSaved( true );
					currentThemeJsonFile.get();
					resolve( data );
				} );
		} );
	}

	return {
		data: themeData,
		set: setThemeData,
		save: saveThemeData,
		existsOnDisk,
		hasSaved,
	};
}
