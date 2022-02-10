/**
 * Genesis Studio App, non visual logic.
 */

const { __ } = wp.i18n;

import { useState, useEffect } from '@wordpress/element';

export const FseStudioContext = React.createContext( [
	{},
	function () {},
] );

export function useCurrentThemeJsonFileData(initial) {
	const [value, setValue] = useState(initial);
	
	return {
		value,
		setValue,
	}
}

export function useThemeJsonFile( id ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ themeJsonData, setThemeJsonData ] = useState();

	useEffect( () => {
		// If the id passed in changes, get the new themeJson data related to it.
		getThemeJsonData( id );
	}, [ id ] );

	function getThemeJsonData( id ) {
		return new Promise( ( resolve, reject ) => {
			if ( ! id || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch(
				assembleUrlWithQueryParams(fsestudio.apiEndpoints.getThemeJsonFileEndpoint, {filename: id }),
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
		return new Promise( ( resolve, reject ) => {
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
				const response = JSON.parse( data );
				getThemeJsonData(id);
				resolve( data );
			} );
		} );
	}

	return {
		data: themeJsonData,
		set: setThemeJsonData,
		save: saveThemeJsonData,
	};
}

export function useThemeData( themeId, themes ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [hasSaved, setHasSaved] = useState( false );
	const [ themeData, setThemeData ] = useState();

	useEffect( () => {
		setHasSaved( false );
	}, [themeData] );

	useEffect( () => {
		// If the themeId passed in changes, get the new theme data related to it.
		getThemeData( themeId );
	}, [ themeId ] );

	function getThemeData( themeId ) {
		return new Promise( ( resolve, reject ) => {
			if ( ! themeId || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch(
				assembleUrlWithQueryParams(fsestudio.apiEndpoints.getThemeEndpoint, {themeId: themeId }),
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
						// If the theme does not yet exist on the server, grab the theme data from the theme list.
						console.log( themes.themes );

						setThemeData( themes.themes[ themeId ] );
					} else {
						setThemeData( response );
						resolve( response );
					}
				} );
		} );
	}

	function saveThemeData() {
		return new Promise( ( resolve, reject ) => {
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
					const response = JSON.parse( data );
					setHasSaved(true);
					resolve( data );
				} );
		} );
	}

	return {
		data: themeData,
		set: setThemeData,
		save: saveThemeData,
		hasSaved
	};
}

export function usePatternData( patternId ) {
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ patternData, setPatternData ] = useState();

	useEffect( () => {
		// If the patternId passed in changes, get the new pattern data related to it.
		getPatternData( patternId );
	}, [ patternId ] );

	function getPatternData( patternId ) {
		return new Promise( ( resolve, reject ) => {
			if ( ! patternId || fetchInProgress ) {
				resolve();
				return;
			}
			setFetchInProgress( true );

			fetch(
				assembleUrlWithQueryParams(fsestudio.apiEndpoints.getPatternEndpoint, {patternId: patternId }),
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
		return new Promise( ( resolve, reject ) => {
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
					const response = JSON.parse( data );
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

function string_to_slug( str ) {
	str = str.replace( /^\s+|\s+$/g, '' ); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
	const to = 'aaaaeeeeiiiioooouuuunc------';
	for ( let i = 0, l = from.length; i < l; i++ ) {
		str = str.replace(
			new RegExp( from.charAt( i ), 'g' ),
			to.charAt( i )
		);
	}

	str = str
		.replace( /[^a-z0-9 -]/g, '' ) // remove invalid chars
		.replace( /\s+/g, '-' ) // collapse whitespace and replace by -
		.replace( /-+/g, '-' ); // collapse dashes

	return str;
}

function assembleUrlWithQueryParams( theUrl, params ) {
	const url = new URL(theUrl);
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	return url;
}