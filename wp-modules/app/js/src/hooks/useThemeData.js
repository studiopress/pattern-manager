/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../';
import assembleUrl from '../utils/assembleUrl';
import convertToSlug from '../utils/convertToSlug';
import convertToPascalCase from '../utils/convertToPascalCase';

/**
 * @typedef {Partial<{
 *   name: string,
 *   namespace: string,
 *   'index.html'?: string,
 *   '404.html'?: string,
 *   'archive.html'?: string,
 *   'single.html'?: string,
 *   'page.html'?: string,
 *   'search.html'?: string,
 *   author: string,
 *   author_uri: string,
 *   description: string,
 *   dirname: string,
 *   included_patterns: string[],
 *   requires_php: string,
 *   requires_wp: string,
 *   rest_route?: string,
 *   tags: string,
 *   template_files: Partial<{
 *    index: string,
 *    '404': string,
 *    archive: string,
 *    single: string,
 *    page: string,
 *    search: string,
 *   }>,
 *   tested_up_to: string,
 *   text_domain: string,
 *   theme_json_file: string,
 *   uri: string,
 *   version: string
 * }>} Theme
 */

/**
 * @typedef {{
 *  wp_head: string,
 *  wp_footer: string,
 *  renderedPatterns: string
 * }} PatternPreviewParts
 */

/**
 * @param {string}                                           themeId
 * @param {ReturnType<import('./useThemes').default>}        themes
 * @param {ReturnType<import('./useThemeJsonFile').default>} currentThemeJsonFile
 */
export default function useThemeData( themeId, themes, currentThemeJsonFile ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ hasSaved, setHasSaved ] = useState( false );

	/** @type {[Theme, React.Dispatch<React.SetStateAction<Theme>>]} */
	const [ themeData, setThemeData ] = useState();
	const [ existsOnDisk, setExistsOnDisk ] = useState( false );

	useEffect( () => {
		setHasSaved( false );
	}, [ themeData ] );

	useEffect( () => {
		// If the themeId passed in changes, get the new theme data related to it.
		getThemeData( themeId );
	}, [ themeId ] );

	useEffect( () => {
		if ( themeData?.name ) {
			setThemeData( {
				...themeData,
				dirname: convertToSlug( themeData?.name ),
				namespace: convertToPascalCase( themeData?.name ),
				text_domain: convertToSlug( themeData?.name ),
			} );
		}
	}, [ themeData?.name ] );

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
						'X-WP-Nonce': fsestudio.apiNonce,
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
					'X-WP-Nonce': fsestudio.apiNonce,
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

	function exportThemeData() {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.exportThemeEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': fsestudio.apiNonce,
				},
				body: JSON.stringify( themeData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data ) => {
					resolve( data );
				} );
		} );
	}

	return {
		data: themeData,
		set: setThemeData,
		save: saveThemeData,
		export: exportThemeData,
		existsOnDisk,
		hasSaved,
	};
}
