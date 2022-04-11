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
		console.log( 'Theme Json updated to', themeJsonData );
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
		console.log( 'Saving JSON1', themeJsonData );
		return new Promise( ( resolve ) => {
			console.log( 'Saving JSON2', themeJsonData, JSON.stringify(themeJsonData.content) );
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
	
	function setValue( topLevelSection = 'settings', selectorString, value = null, defaultValue = null, mode = 'overwrite' ) {
		const modifiedData = { ...themeJsonData };
		
		// Remove any leading commas that might exist.
		if (selectorString[0] === '.') { 
			selectorString = selectorString.substring(1);
		}
		
		// Split the selector string at commas
		const keys = selectorString.split('.');
	
		const numberOfKeys = keys.length;
		
		if ( ! modifiedData.content[topLevelSection] || Array.isArray( modifiedData.content[topLevelSection] ) ) {
			modifiedData.content[topLevelSection] = {};
		}

		if ( numberOfKeys === 1 ) {
			const keyOne = [keys[0]];
			
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData.content[topLevelSection] ) {
				modifiedData.content[topLevelSection] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData.content[topLevelSection].splice(parseInt(keyOne) + 1, 0, value);
			} 
			if ( mode === 'overwrite' ) {
				modifiedData.content[topLevelSection][keyOne] = value;
			}
			if ( ( defaultValue !== null && defaultValue === value ) || null === value ) {
				delete modifiedData.content[topLevelSection][keyOne];
			}
			
		}
		if ( numberOfKeys === 2 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			
			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData.content[topLevelSection] ) {
				modifiedData.content[topLevelSection] = {};
			}
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData.content[topLevelSection][keyOne] ) {
				modifiedData.content[topLevelSection][keyOne] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData.content[topLevelSection][keyOne].splice(parseInt(keyTwo) + 1, 0, value);
			} 
			if ( mode === 'overwrite' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo] = value;
			}
			// If we are deleting or setting this value back to its default from the schema.
			if ( ( defaultValue !== null && defaultValue === value ) || null === value ) {
				if ( Array.isArray(modifiedData.content[topLevelSection][keyOne] ) ) {
					modifiedData.content[topLevelSection][keyOne].splice(keyTwo, 1);
				} else {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo];
				}
			}
			
			// Clean up the parent if there's no more children.
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne];
			}
		}
		if ( numberOfKeys === 3 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			
			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData.content[topLevelSection] ) {
				modifiedData.content[topLevelSection] = {};
			}
			// If keyone does not exist yet, set it first, then set keytwo after.
			if ( ! modifiedData.content[topLevelSection][keyOne] ) {
				modifiedData.content[topLevelSection][keyOne] = {};
			}
			if ( ! modifiedData.content[topLevelSection][keyOne][keyTwo] ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo].splice(parseInt(keyThree) + 1, 0, value);
			} 
			if ( mode === 'overwrite' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree] = value;
			}
			if ( ( defaultValue !== null && defaultValue === value ) || null === value ) {
				if ( Array.isArray(modifiedData.content[topLevelSection][keyOne][keyTwo] ) ) {
					modifiedData.content[topLevelSection][keyOne][keyTwo].splice(keyThree, 1);
				} else {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree];
				}
			}
			
			// Clean up the parents if there's no more children.
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
			}
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne];
			}
		
		}
		if ( numberOfKeys === 4 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];

			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData.content[topLevelSection] ) {
				modifiedData.content[topLevelSection] = {};
			}
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
			if ( mode === 'insert' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree].splice(parseInt(keyFour) + 1, 0, value);
			} 
			if ( mode === 'overwrite' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour] = value;
			}
			if ( ( defaultValue !== null && defaultValue === value ) || null === value ) {
				if ( Array.isArray(modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree] ) ) {
					modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree].splice(keyFour, 1);
				} else {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour];
				}
			}
			
			// Clean up the parents if there's no more children.
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
			}
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
			}
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne];
			}
			
		}
		
		if ( numberOfKeys === 5 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];
			const keyFive = [keys[4]];

			// If the top level section does not exist yet, set it first.
			if ( ! modifiedData.content[topLevelSection] ) {
				modifiedData.content[topLevelSection] = {};
			}
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
			if ( ! modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour] ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour] = {};
			}
			if ( mode === 'insert' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour].splice(parseInt(keyFive) + 1, 0, value);
			} 
			if ( mode === 'overwrite' ) {
				modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour][keyFive] = value;
			}
			if ( ( defaultValue !== null && defaultValue === value ) || null === value ) {
				if ( Array.isArray(modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour] ) ) {
					modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour].splice(keyFive, 1);
				} else {
					delete modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour][keyFive];
				}
			}
			
			// Clean up the parents if there's no more children.
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
			}
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo][keyThree]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
			}
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne][keyTwo]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne][keyTwo];
			}
			if ( Object.entries(modifiedData.content[topLevelSection][keyOne]).length === 0 ) {
				delete modifiedData.content[topLevelSection][keyOne];
			}
			
		}

		setThemeJsonData( modifiedData );

	}
	
	function getValue( topLevelSection = 'settings', selectorString, defaultValue = undefined ) {
		// Remove any leading commas that might exist.
		if (selectorString[0] === '.') { 
			selectorString = selectorString.substring(1);
		}

		// Split the selector string at commas
		const keys = selectorString.split('.');
	
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
		
		if ( numberOfKeys === 5 ) {
			const keyOne = [keys[0]];
			const keyTwo = [keys[1]];
			const keyThree = [keys[2]];
			const keyFour = [keys[3]];
			const keyFive = [keys[4]];

			if (themeJsonData.content[topLevelSection].hasOwnProperty(keyOne)) {
				if ( themeJsonData.content[topLevelSection][keyOne].hasOwnProperty(keyTwo) ) {
					if ( themeJsonData.content[topLevelSection][keyOne][keyTwo].hasOwnProperty(keyThree) ) {
						if ( themeJsonData.content[topLevelSection][keyOne][keyTwo][keyThree].hasOwnProperty(keyFour) ) {
							if ( themeJsonData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour].hasOwnProperty(keyFive) ) {
								return themeJsonData.content[topLevelSection][keyOne][keyTwo][keyThree][keyFour][keyFive]
							}
						}
					}
				}
			}
		}
		
		// Return the default value for this from the schema.
		return defaultValue;
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
