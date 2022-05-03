/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../globals';
import assembleUrl from '../utils/assembleUrl';
import convertToSlug from '../utils/convertToSlug';
import convertToPascalCase from '../utils/convertToPascalCase';

import useSnackbarContext from './useSnackbarContext';

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
 *   template_files: string[],
 *   template_parts: string[],
 *   tested_up_to: string,
 *   text_domain: string,
 *   theme_json_file: string[],
 *   uri: string,
 *   version: string
 * }>} Theme
 */

/**
 * @param {string}                                           themeId
 * @param {ReturnType<import('./useThemes').default>}        themes
 */
export default function useThemeData( themeId, themes, patternEditorIframe, currentView ) {
	const snackBar = useSnackbarContext();
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ saveCompleted, setSaveCompleted ] = useState( true );

	/** @type {[Theme, React.Dispatch<React.SetStateAction<Theme>>]} */
	const [ themeData, setThemeData ] = useState();
	const [ existsOnDisk, setExistsOnDisk ] = useState( false );
	const [ themeNameIsDefault, setThemeNameIsDefault ] = useState( false );
	
	const [autoSaveTheme, setAutoSaveTheme] = useState( false );

	useEffect( () => {
		if ( themeData?.name === 'My New Theme' ) {
			setThemeNameIsDefault( true );
		} else {
			setThemeNameIsDefault( false );
		}
		
		if ( themeData && autoSaveTheme ) {
			saveThemeData();
		}
	}, [ themeData ] );

	useEffect( () => {
		// If the themeId passed in changes, get the new theme data related to it.
		if ( themeId ) {
			console.log( 'theme id just changed' );
			getThemeData();
		}

		setThemeNameIsDefault( false );
	}, [ themeId ] );

	useEffect( () => {
		if ( themeData?.name ) {
			setThemeData( {
				...themeData,
				dirname: convertToSlug( themeData?.name ),
				namespace: convertToPascalCase( themeData?.name ),
				text_domain: convertToSlug( themeData?.name ),
			} );
			
			convertToSlug( themeData?.name )
		}
	}, [ themeData?.name ] );

	function getThemeData() {
		return new Promise( ( resolve ) => {
			if ( ! themeId || fetchInProgress ) {
				resolve();
				return;
			}
			if ( ! themeData?.dirname ) {
				console.log( themes.themes, themeId );
				
				setThemeData( themes.themes[ themeId ] );
				setExistsOnDisk( false );
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch( fsestudio.apiEndpoints.getThemeEndpoint,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'X-WP-Nonce': fsestudio.apiNonce,
					},
					body: JSON.stringify( {
						themeId: themeData.dirname,
						preExistingTheme: themeData
					}),
				}
			)
				.then( ( response ) => response.json() )
				.then( ( response ) => {
					setFetchInProgress( false );
					if (
						response.error &&
						response.error === 'theme_not_found'
					) {
						setThemeData( themes.themes[ themeId ] );
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
		if ( themeData.name === 'My New Theme' ) {
			setThemeNameIsDefault( true );
			return;
		}
		setSaveCompleted( false );

		return new Promise( ( resolve ) => {
			setThemeNameIsDefault( false );
			fetch( fsestudio.apiEndpoints.saveThemeEndpoint, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-WP-Nonce': fsestudio.apiNonce,
				},
				body: JSON.stringify( themeData ),
			} )
				.then( ( response ) => {
					if ( ! response.ok ) {
						throw response.statusText;
					}
					return response.json();
				} )
				.then( ( data ) => {
					setExistsOnDisk( true );
					setSaveCompleted( true );
					if ( autoSaveTheme ) {
						setAutoSaveTheme( false );
					}
					if ( ! autoSaveTheme ) {
						snackBar.setValue( data.message );
					}
					setThemeData( data.themeData );

					// Send a message to the iframe, telling it to save and refresh.
					if ( patternEditorIframe.current ) {
						if ( currentView.currentView === 'pattern_editor' ) {
							patternEditorIframe.current.contentWindow.postMessage(
								JSON.stringify( {
									message: 'fsestudio_save',
								} )
							);
						} else {
							patternEditorIframe.current.contentWindow.postMessage(
								JSON.stringify( {
									message: 'fsestudio_save_and_refresh',
								} )
							);
						}
					}

					resolve( data );
				} )
				.catch( ( errorMessage ) => {
					snackBar.setValue( JSON.stringify( errorMessage ) );
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
					snackBar.setValue( JSON.stringify( data ) );
					resolve( data );
				} );
		} );
	}
	
	function setThemeJsonValue(
		topLevelSection = 'settings',
		selectorString,
		value = null,
		defaultValue = null,
		mode = 'overwrite'
	) {
		const modifiedData = { ...themeData.theme_json_file };

		// Remove any leading commas that might exist.
		if ( selectorString[ 0 ] === '.' ) {
			selectorString = selectorString.substring( 1 );
		}

		// Split the selector string at commas
		const keys = selectorString.split( '.' );

		const numberOfKeys = keys.length;

		if (
			! modifiedData[ topLevelSection ] ||
			Array.isArray( modifiedData[ topLevelSection ] )
		) {
			modifiedData[ topLevelSection ] = {};
		}

		if ( numberOfKeys === 1 ) {
			const keyOne = [ keys[ 0 ] ];

			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData[ topLevelSection ] ) {
				modifiedData[ topLevelSection ] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData[ topLevelSection ].splice(
					parseInt( keyOne ) + 1,
					0,
					value
				);
			}
			if ( mode === 'overwrite' ) {
				modifiedData[ topLevelSection ][ keyOne ] = value;
			}
			if (
				( defaultValue !== null && defaultValue === value ) ||
				null === value
			) {
				delete modifiedData[ topLevelSection ][ keyOne ];
			}
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];

			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData[ topLevelSection ] ) {
				modifiedData[ topLevelSection ] = {};
			}
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData[ topLevelSection ][ keyOne ] ) {
				modifiedData[ topLevelSection ][ keyOne ] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData[ topLevelSection ][ keyOne ].splice(
					parseInt( keyTwo ) + 1,
					0,
					value
				);
			}
			if ( mode === 'overwrite' ) {
				modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				] = value;
			}
			// If we are deleting or setting this value back to its default from the schema.
			if (
				( defaultValue !== null && defaultValue === value ) ||
				null === value
			) {
				if (
					Array.isArray(
						modifiedData[ topLevelSection ][ keyOne ]
					)
				) {
					modifiedData[ topLevelSection ][ keyOne ].splice(
						keyTwo,
						1
					);
				} else {
					delete modifiedData[ topLevelSection ][ keyOne ][
						keyTwo
					];
				}
			}

			// Clean up the parent if there's no more children.
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ];
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];
			const keyThree = [ keys[ 2 ] ];

			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData[ topLevelSection ] ) {
				modifiedData[ topLevelSection ] = {};
			}
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData[ topLevelSection ][ keyOne ] ) {
				modifiedData[ topLevelSection ][ keyOne ] = {};
			}
			if (
				! modifiedData[ topLevelSection ][ keyOne ][ keyTwo ]
			) {
				modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				].splice( parseInt( keyThree ) + 1, 0, value );
			}
			if ( mode === 'overwrite' ) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				] = value;
			}
			if (
				( defaultValue !== null && defaultValue === value ) ||
				null === value
			) {
				if (
					Array.isArray(
						modifiedData[ topLevelSection ][ keyOne ][
							keyTwo
						]
					)
				) {
					modifiedData[ topLevelSection ][ keyOne ][
						keyTwo
					].splice( keyThree, 1 );
				} else {
					delete modifiedData[ topLevelSection ][ keyOne ][
						keyTwo
					][ keyThree ];
				}
			}

			// Clean up the parents if there's no more children.
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				];
			}
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ];
			}
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];
			const keyThree = [ keys[ 2 ] ];
			const keyFour = [ keys[ 3 ] ];

			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData[ topLevelSection ] ) {
				modifiedData[ topLevelSection ] = {};
			}
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData[ topLevelSection ][ keyOne ] ) {
				modifiedData[ topLevelSection ][ keyOne ] = {};
			}
			if (
				! modifiedData[ topLevelSection ][ keyOne ][ keyTwo ]
			) {
				modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				] = {};
			}
			if (
				! modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				]
			) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				].splice( parseInt( keyFour ) + 1, 0, value );
			}
			if ( mode === 'overwrite' ) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				][ keyFour ] = value;
			}
			if (
				( defaultValue !== null && defaultValue === value ) ||
				null === value
			) {
				if (
					Array.isArray(
						modifiedData[ topLevelSection ][ keyOne ][
							keyTwo
						][ keyThree ]
					)
				) {
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
						keyThree
					].splice( keyFour, 1 );
				} else {
					delete modifiedData[ topLevelSection ][ keyOne ][
						keyTwo
					][ keyThree ][ keyFour ];
				}
			}

			// Clean up the parents if there's no more children.
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
						keyThree
					]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				];
			}
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				];
			}
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ];
			}
		}

		if ( numberOfKeys === 5 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];
			const keyThree = [ keys[ 2 ] ];
			const keyFour = [ keys[ 3 ] ];
			const keyFive = [ keys[ 4 ] ];

			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData[ topLevelSection ] ) {
				modifiedData[ topLevelSection ] = {};
			}
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData[ topLevelSection ][ keyOne ] ) {
				modifiedData[ topLevelSection ][ keyOne ] = {};
			}
			if (
				! modifiedData[ topLevelSection ][ keyOne ][ keyTwo ]
			) {
				modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				] = {};
			}
			if (
				! modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				]
			) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				] = {};
			}
			if (
				! modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				][ keyFour ]
			) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				][ keyFour ] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				][ keyFour ].splice( parseInt( keyFive ) + 1, 0, value );
			}
			if ( mode === 'overwrite' ) {
				modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
					keyThree
				][ keyFour ][ keyFive ] = value;
			}
			if (
				( defaultValue !== null && defaultValue === value ) ||
				null === value
			) {
				if (
					Array.isArray(
						modifiedData[ topLevelSection ][ keyOne ][
							keyTwo
						][ keyThree ][ keyFour ]
					)
				) {
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
						keyThree
					][ keyFour ].splice( keyFive, 1 );
				} else {
					delete modifiedData[ topLevelSection ][ keyOne ][
						keyTwo
					][ keyThree ][ keyFour ][ keyFive ];
				}
			}

			// Clean up the parents if there's no more children.
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
						keyThree
					][ keyFour ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				];
			}
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ][
						keyThree
					]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				];
			}
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ][ keyTwo ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ][
					keyTwo
				];
			}
			if (
				Object.entries(
					modifiedData[ topLevelSection ][ keyOne ]
				).length === 0
			) {
				delete modifiedData[ topLevelSection ][ keyOne ];
			}
		}

		setThemeData( {
			...themeData,
			theme_json_file: modifiedData,
		} );
	}

	function getThemeJsonValue(
		topLevelSection = 'settings',
		selectorString,
		defaultValue = undefined
	) {
		// Remove any leading commas that might exist.
		if ( selectorString[ 0 ] === '.' ) {
			selectorString = selectorString.substring( 1 );
		}

		// Split the selector string at commas
		const keys = selectorString.split( '.' );

		const numberOfKeys = keys.length;

		if ( numberOfKeys === 1 ) {
			const keyOne = [ keys[ 0 ] ];
			if (
				themeData.theme_json_file[ topLevelSection ].hasOwnProperty(
					keyOne
				)
			) {
				return themeData.theme_json_file[ topLevelSection ][ keyOne ];
			}
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];

			if (
				themeData.theme_json_file[ topLevelSection ].hasOwnProperty(
					keyOne
				)
			) {
				if (
					themeData.theme_json_file[ topLevelSection ][
						keyOne
					].hasOwnProperty( keyTwo )
				) {
					return themeData.theme_json_file[ topLevelSection ][ keyOne ][
						keyTwo
					];
				}
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];
			const keyThree = [ keys[ 2 ] ];

			if (
				themeData.theme_json_file[ topLevelSection ].hasOwnProperty(
					keyOne
				)
			) {
				if (
					themeData.theme_json_file[ topLevelSection ][
						keyOne
					].hasOwnProperty( keyTwo )
				) {
					if (
						themeData.theme_json_file[ topLevelSection ][ keyOne ][
							keyTwo
						].hasOwnProperty( keyThree )
					) {
						return themeData.theme_json_file[ topLevelSection ][
							keyOne
						][ keyTwo ][ keyThree ];
					}
				}
			}
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];
			const keyThree = [ keys[ 2 ] ];
			const keyFour = [ keys[ 3 ] ];

			if (
				themeData.theme_json_file[ topLevelSection ].hasOwnProperty(
					keyOne
				)
			) {
				if (
					themeData.theme_json_file[ topLevelSection ][
						keyOne
					].hasOwnProperty( keyTwo )
				) {
					if (
						themeData.theme_json_file[ topLevelSection ][ keyOne ][
							keyTwo
						].hasOwnProperty( keyThree )
					) {
						if (
							themeData.theme_json_file[ topLevelSection ][ keyOne ][
								keyTwo
							][ keyThree ].hasOwnProperty( keyFour )
						) {
							return themeData.theme_json_file[ topLevelSection ][
								keyOne
							][ keyTwo ][ keyThree ][ keyFour ];
						}
					}
				}
			}
		}

		if ( numberOfKeys === 5 ) {
			const keyOne = [ keys[ 0 ] ];
			const keyTwo = [ keys[ 1 ] ];
			const keyThree = [ keys[ 2 ] ];
			const keyFour = [ keys[ 3 ] ];
			const keyFive = [ keys[ 4 ] ];

			if (
				themeData.theme_json_file[ topLevelSection ].hasOwnProperty(
					keyOne
				)
			) {
				if (
					themeData.theme_json_file[ topLevelSection ][
						keyOne
					].hasOwnProperty( keyTwo )
				) {
					if (
						themeData.theme_json_file[ topLevelSection ][ keyOne ][
							keyTwo
						].hasOwnProperty( keyThree )
					) {
						if (
							themeData.theme_json_file[ topLevelSection ][ keyOne ][
								keyTwo
							][ keyThree ].hasOwnProperty( keyFour )
						) {
							if (
								themeData.theme_json_file[ topLevelSection ][
									keyOne
								][ keyTwo ][ keyThree ][
									keyFour
								].hasOwnProperty( keyFive )
							) {
								return themeData.theme_json_file[ topLevelSection ][
									keyOne
								][ keyTwo ][ keyThree ][ keyFour ][ keyFive ];
							}
						}
					}
				}
			}
		}

		// Return the default value for this from the schema.
		return defaultValue;
	}

	function createPattern( patternData ) {
		setAutoSaveTheme( true );

		return new Promise( ( resolve ) => {
			let newThemeData = {};
			if ( patternData.type === 'pattern' ) {
				newThemeData = {
					...themeData,
					included_patterns: {
						...themeData.included_patterns,
						[patternData.name]: patternData,
					}
				}
			}
			if ( patternData.type === 'template' ) {
				newThemeData = {
					...themeData,
					template_files: {
						...themeData.template_files,
						[patternData.name]: patternData,
					}
				}
			}
			if ( patternData.type === 'template_part' ) {
				newThemeData = {
					...themeData,
					template_parts: {
						...themeData.template_parts,
						[patternData.name]: patternData,
					}
				}
			}
			setThemeData( newThemeData );
			resolve( newThemeData );
		} );
	}

	return {
		data: themeData,
		set: setThemeData,
		getThemeJsonValue,
		setThemeJsonValue,
		createPattern,
		get: getThemeData,
		save: saveThemeData,
		export: exportThemeData,
		existsOnDisk,
		saveCompleted,
		themeNameIsDefault,
	};
}
