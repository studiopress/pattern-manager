/* global fetch */
// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

import { fsestudio } from '../';
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
	
	function setValue( topLevelSection = 'settings', selectorString, value, type = 'overwrite' ) {
		const modifiedData = { ...themeJsonData };
		
		// Remove any leading commas that might exist.
		if (selectorString[0] == ',') { 
			selectorString = selectorString.substring(1);
		}
		
		// Split the selector string at commas
		const keys = selectorString.split(',');
	
		const numberOfKeys = keys.length;
	
		if ( numberOfKeys === 1 ) {
			const keyOne = [keys[0]];
			if ( value ) {
				if ( type === 'insert' ) {
					modifiedData.content[topLevelSection].splice(keyOne, 0, value);
				} 
				if ( type === 'overwrite' ) {
					modifiedData.content[topLevelSection][keyOne]
				}
			} else {
				delete modifiedData.content[topLevelSection][keyOne];
			}
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			
			if ( value ) {
				// If keyone already exists, and keytwo already exists, just change the value.
				if( modifiedData.content[topLevelSection][keyOne] && modifiedData.content[topLevelSection][keyOne][keyTwo] ) {
					if ( type === 'insert' ) {
						modifiedData.content[topLevelSection][keyOne].splice(keyTwo, 0, value);
					} 
					if ( type === 'overwrite' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo] = value;
					}
				} else {
					// If keyone does not exist yet, set it first, then set keytwo after.
					if ( ! modifiedData.content[topLevelSection][keyOne] ) {
						modifiedData.content[topLevelSection][keyOne] = {};
					}
					if ( type === 'insert' ) {
						modifiedData.content[topLevelSection][keyOne].splice(keyTwo, 0, value);
					} 
					if ( type === 'overwrite' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo] = value;
					}
				}
			} else {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
				// If this is the last value in keyOne, delete the keyOne as well.
				if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
					delete modifiedData.content[topLevelSection][keyOne];
				}
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];

			if ( value ) {
				// If keys aready exists, just change the value.
				if (
					modifiedData.content[topLevelSection][keyOne] &&
					modifiedData.content[topLevelSection][keyOne][keyTwo] &&
					modifiedData.content[topLevelSection][keyOne][keyThree]
				) {
					if ( type === 'insert' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo].splice(keyThree, 0, value);
					} 
					if ( type === 'overwrite' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree] = value;
					}
				} else {
					// If keyone does not exist yet, set it first, then set keytwo after.
					if ( ! modifiedData.content[topLevelSection][keyOne] ) {
						modifiedData.content[topLevelSection][keyOne] = {};
					}
					if ( ! modifiedData.content[topLevelSection][keyOne][keyTwo] ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo] = {};
					}
					if ( type === 'insert' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo].splice(keyThree, 0, value);
					} 
					if ( type === 'overwrite' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree] = value;
					}
				}
			} else {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree];

				// If this is the last value in keyTwo, delete the keyTwo as well.
				if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo]).length === 0 ) {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo];
				}
				// If this is the last value in keyOne, delete the keyOne as well.
				if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
					delete modifiedData.content[topLevelSection][keyOne];
				}
			}
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];
			if ( value ) {
				// If keys aready exists, just change the value.
				if (
					modifiedData.content[topLevelSection][keyOne] &&
					modifiedData.content[topLevelSection][keyOne][keyTwo] &&
					modifiedData.content[topLevelSection][keyOne][keyThree] &&
					modifiedData.content[topLevelSection][keyOne][keyFour]
				) {
					if ( type === 'insert' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree].splice(keyFour, 0, value);
					} 
					if ( type === 'overwrite' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour] = value;
					}
				} else {
					// If keyone does not exist yet, set it first, then set keytwo after.
					if ( ! modifiedData.content[topLevelSection][keyOne] ) {
						modifiedData.content[topLevelSection][keyOne] = {};
					}
					if ( ! modifiedData.content[topLevelSection][keyOne][keyTwo] ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo] = {};
					}
					if ( ! modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree] ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree] = {};
					}
					if ( type === 'insert' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree].splice(keyFour, 0, value);
					} 
					if ( type === 'overwrite' ) {
						modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour] = value;
					}
				}
			} else {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour];
				// If this is the last value in keyThree, delete the keyThree as well.
				if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree]).length === 0 ) {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree];
				}
				// If this is the last value in keyTwo, delete the keyTwo as well.
				if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo]).length === 0 ) {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo];
				}
				// If this is the last value in keyOne, delete the keyOne as well.
				if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
					delete modifiedData.content[topLevelSection][keyOne];
				}
			}
		}

		setThemeJsonData( modifiedData );

	}
	
	function getValue( topLevelSection = 'settings', selectorString, type ) {
		// Remove any leading commas that might exist.
		if (selectorString[0] == ',') { 
			selectorString = selectorString.substring(1);
		}

		// Split the selector string at commas
		const keys = selectorString.split(',');
	
		const numberOfKeys = keys.length;

		if ( numberOfKeys === 1 ) {
			const keyOne = [keys[0]];
			if (themeJsonData.content[topLevelSection].hasOwnProperty(keyOne)) {
				return themeJsonData.content[topLevelSection][keyOne];
			}
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];

			if (themeJsonData.content[topLevelSection].hasOwnProperty(keyOne)) {
				if ( themeJsonData.content[topLevelSection][keyOne].hasOwnProperty(keyTwo) ) {
					return themeJsonData.content[topLevelSection][keyOne][keyTwo]
				}
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];

			if (themeJsonData.content[topLevelSection].hasOwnProperty(keyOne)) {
				if ( themeJsonData.content[topLevelSection][keyOne].hasOwnProperty(keyTwo) ) {
					if ( themeJsonData.content[topLevelSection][keyOne][keyTwo].hasOwnProperty(keyThree) ) {
						return themeJsonData.content[topLevelSection][keyOne][keyTwo][keyThree]
					}
				}
			}
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];

			if (themeJsonData.content[topLevelSection].hasOwnProperty(keyOne)) {
				if ( themeJsonData.content[topLevelSection][keyOne].hasOwnProperty(keyTwo) ) {
					if ( themeJsonData.content[topLevelSection][keyOne][keyTwo].hasOwnProperty(keyThree) ) {
						if ( themeJsonData.content[topLevelSection][keyOne][keyTwo][keyThree].hasOwnProperty(keyFour) ) {
							return themeJsonData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour]
						}
					}
				}
			}
		}
		
		if ( type === 'boolean' ) {
			return false;
		}
		
		return null;
	}

	return {
		data: themeJsonData,
		get: getThemeJsonData,
		set: setThemeJsonData,
		save: saveThemeJsonData,
		getValue,
		setValue,
		hasSaved,
	};
}
