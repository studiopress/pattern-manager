/**
 * Genesis Studio App, non visual logic.
 */

/* global fetch, fsestudio */

import { useState, useEffect, createContext } from '@wordpress/element';

export const FseStudioContext = createContext( [ {}, function () {} ] );

export function useCurrentThemeJsonFileData( initial ) {
	const [ value, setValue ] = useState( initial );

	return {
		value,
		setValue,
	};
}

export function usePatternPreviewParts() {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ data, set ] = useState();

	useEffect( () => {
		getPatternPreviewParts();
	}, [] );

	function getPatternPreviewParts() {
		return new Promise( ( resolve ) => {
			if ( fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch( fsestudio.apiEndpoints.getFrontendPreviewPartsEndpoint, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			} )
				.then( ( response ) => response.json() )
				.then( ( response ) => {
					setFetchInProgress( false );
					set( response );
					resolve( response );
				} );
		} );
	}

	return {
		data,
	};
}

export function useThemeJsonFile( id ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ themeJsonData, setThemeJsonData ] = useState();
	const [ hasSaved, setHasSaved ] = useState( false );

	useEffect( () => {
		setHasSaved( false );
	}, [ themeJsonData ] );

	useEffect( () => {
		// If the id passed in changes, get the new themeJson data related to it.
		getThemeJsonData( id );
	}, [ id ] );

	function getThemeJsonData( thisId ) {
		return new Promise( ( resolve ) => {
			if ( ! thisId || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch(
				assembleUrlWithQueryParams(
					fsestudio.apiEndpoints.getThemeJsonFileEndpoint,
					{ filename: thisId }
				),
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
					getThemeJsonData( id );
					setHasSaved( true );
					resolve( data );
				} );
		} );
	}

	return {
		data: themeJsonData,
		set: setThemeJsonData,
		save: saveThemeJsonData,
		hasSaved,
	};
}

export function useThemeData( themeId, themes ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ hasSaved, setHasSaved ] = useState( false );
	const [ themeData, setThemeData ] = useState();

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
				assembleUrlWithQueryParams(
					fsestudio.apiEndpoints.getThemeEndpoint,
					{ themeId: thisThemeId }
				),
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
					} else {
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
					setHasSaved( true );
					resolve( data );
				} );
		} );
	}

	return {
		data: themeData,
		set: setThemeData,
		save: saveThemeData,
		hasSaved,
	};
}

export function usePatternData( patternId ) {
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
				assembleUrlWithQueryParams(
					fsestudio.apiEndpoints.getPatternEndpoint,
					{ patternId: thisPatternId }
				),
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
					setPatternData( response );
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

export function useThemes( initial ) {
	const [ themes, setThemes ] = useState( initial.themes );

	return {
		themes,
		setThemes,
	};
}

export function usePatterns( initialPatterns ) {
	const [ patterns, setPatterns ] = useState( initialPatterns );

	return {
		patterns,
		setPatterns,
	};
}

export function useThemeJsonFiles( initialPatterns ) {
	const [ themeJsonFiles, setThemeJsonFiles ] = useState( initialPatterns );

	return {
		themeJsonFiles,
		setThemeJsonFiles,
	};
}

export function useCurrentView( initial ) {
	const [ currentView, set ] = useState( initial.currentView );

	return {
		currentView,
		set,
	};
}

function assembleUrlWithQueryParams( theUrl, params ) {
	const url = new URL( theUrl );
	Object.keys( params ).forEach( ( key ) =>
		url.searchParams.append( key, params[ key ] )
	);
	return url;
}
