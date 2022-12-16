import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { fsestudio } from '../globals';
import getHeaders from '../utils/getHeaders';
import { getNestedValue, setNestedObject } from '../utils/nestedObjectUtility';

import useNoticeContext from './useNoticeContext';
import usePatterns from './usePatterns';

import type { InitialContext, Pattern, Patterns, Theme } from '../types';
import { ThemePatternType } from '../enums';

export default function useThemeData(
	themeId: InitialContext[ 'currentThemeId' ][ 'value' ],
	themes: InitialContext[ 'themes' ],
	patternEditorIframe: InitialContext[ 'patternEditorIframe' ],
	templateEditorIframe: InitialContext[ 'templateEditorIframe' ],
	currentStyleVariationId: InitialContext[ 'currentStyleVariationId' ],
	patterns: ReturnType< typeof usePatterns >
) {
	const { setSnackBarValue } = useNoticeContext();
	const [ isSaving, setIsSaving ] = useState( false );
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ saveCompleted, setSaveCompleted ] = useState( true );
	const themeData = themes.themes[ themeId ];

	const defaultStyleName = useRef( currentStyleVariationId.value );

	function setThemeData( newThemeData: Theme ) {
		themes.setThemes( {
			...themes.themes,
			[ themeId ]: {
				...newThemeData,
			},
		} );
	}

	const editorDirty = useRef( false );
	const [ siteEditorDirty, setSiteEditorDirty ] = useState( false );
	const [ requestThemeRefresh, setRequestThemeRefresh ] = useState( false );

	/** Whether another theme also has the current directory name. */
	function isDirnameTaken() {
		const themeDirNames = Object.keys( themes.themes );
		const otherThemeDirNames = [];
		// Remove this theme from the list of theme directories (a theme can of course have the same dirname as itself).
		for ( const themeDirnameIndex in themeDirNames ) {
			if ( themeDirNames[themeDirnameIndex] !== themeData.id ) {
				otherThemeDirNames.push( themeDirNames[themeDirnameIndex] );
			}
		}
		
		return otherThemeDirNames.includes(themeData.dirname);
	}

	useEffect( () => {
		window.addEventListener(
			'message',
			( event ) => {
				if ( event.data === 'fsestudio_site_editor_dirty' ) {
					setSiteEditorDirty( true );
				}
			},
			false
		);
		// When a pattern or site editor is saved, refresh the theme data.
		window.addEventListener(
			'message',
			( event ) => {
				if ( event.data === 'fsestudio_site_editor_save_complete' ) {
					setSiteEditorDirty( false );
					setRequestThemeRefresh( true );
				}
			},
			false
		);

		window.addEventListener( 'beforeunload', warnIfUnsavedChanges );
		return () => {
			window.removeEventListener( 'beforeunload', warnIfUnsavedChanges );
		};
	}, [] );

	useEffect( () => {
		if ( requestThemeRefresh ) {
			// If something is still dirty, don't do anything yet.
			if ( siteEditorDirty ) {
				setRequestThemeRefresh( false );
			} else {
				setRequestThemeRefresh( false );
				// We have to do this outside the fsestudio_pattern_editor_save_complete listener because currentTheme is stale there.
				uponSuccessfulSave();
				getThemeData();
			}
		}
	}, [ requestThemeRefresh ] );

	/**
	 * Warns the user if there are unsaved changes before leaving.
	 *
	 * Forked from Gutenberg: https://github.com/WordPress/gutenberg/blob/5d5e97abd5e082050fdbb88bb1c93f9dbe10a23b/packages/editor/src/components/unsaved-changes-warning/index.js
	 *
	 * @param {Event} event The beforeunload event.
	 */
	function warnIfUnsavedChanges( event: Event ) {
		if ( editorDirty.current || siteEditorDirty ) {
			// returnValue is deprecated, but preventDefault() isn't always enough to prevent navigating away from the page.
			// @ts-expect-error: returnvalue is deprecated.
			event.returnValue = __(
				'Are you sure you want to leave the editor? There are unsaved changes.',
				'fse-studio'
			);
			event.preventDefault();
		}
	}

	function getThemeData() {
		return new Promise( ( resolve ) => {
			if ( ! themeId || fetchInProgress ) {
				return;
			}
			setFetchInProgress( true );
			fetch( fsestudio.apiEndpoints.getThemeEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( {
					themeId,
				} ),
			} )
				.then( ( response ) => response.json() )
				.then( ( response: Theme & { error?: string } ) => {
					setFetchInProgress( false );
					if (
						response.error &&
						response.error === 'theme_not_found'
					) {
						setThemeData( themes.themes[ themeId ] );
					} else {
						setThemeData( response );
						resolve( response );
					}
				} );
		} );
	}

	function saveThemeData() {
		return new Promise( ( resolve ) => {
			if ( themeData.name === '' ) {
				/* eslint-disable */
				alert( 'You need to change your theme name before saving' );
				/* eslint-enable */
				return;
			}
			setIsSaving( true );
			setSaveCompleted( false );

			fetch( fsestudio.apiEndpoints.saveThemeEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( themeData ),
			} )
				.then( ( response ) => {
					if ( ! response.ok ) {
						throw response.statusText;
					}
					return response.json();
				} )
				.then(
					( data: {
						message: string;
						styleJsonModified: boolean;
						themeData: Theme;
						themeJsonModified: boolean;
					} ) => {
						if ( patternEditorIframe.current ) {
							// Send a message to the iframe, telling it that the themejson has changed.
							if ( data.themeJsonModified ) {
								patternEditorIframe.current.contentWindow.postMessage(
									JSON.stringify( {
										message: 'fsestudio_themejson_changed',
									} ),
									'*'
								);
							}
						}

						if ( templateEditorIframe.current ) {
							templateEditorIframe.current.contentWindow.postMessage(
								JSON.stringify( {
									message: 'fsestudio_save',
								} ),
								'*'
							);

							if ( data.themeJsonModified ) {
								templateEditorIframe.current.contentWindow.postMessage(
									JSON.stringify( {
										message: 'fsestudio_themejson_changed',
									} ),
									'*'
								);
							} else if ( data.styleJsonModified ) {
								templateEditorIframe.current.contentWindow.postMessage(
									JSON.stringify( {
										message: 'fsestudio_stylejson_changed',
									} ),
									'*'
								);
							}
						}

						setThemeData( data.themeData );

						if ( ! siteEditorDirty ) {
							uponSuccessfulSave();
						}

						resolve( data );
					}
				);
		} );
	}

	function uponSuccessfulSave() {
		getThemeData().then( () => {
			setSnackBarValue(
				__(
					'Theme successfully saved and all files written to theme directory',
					'fsestudio'
				)
			);

			editorDirty.current = false;
			setSiteEditorDirty( false );
			setSaveCompleted( true );
			setIsSaving( false );
			patterns?.reloadPatternPreviews();
		} );
	}

	function exportThemeData() {
		return new Promise( ( resolve ) => {
			fetch( fsestudio.apiEndpoints.exportThemeEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( themeData ),
			} )
				.then( ( response ) => response.json() )
				.then( ( data: string ) => {
					window.location.replace( data );
					resolve( data );
				} );
		} );
	}

	function setThemeJsonValue(
		topLevelSection = 'settings',
		selectorString: string,
		value: unknown = null,
		defaultValue: unknown = null
	) {
		const currentStyleValue = currentStyleVariationId?.value;

		// Use theme_json_file if current style variation is default.
		// Otherwise, use the current style variation body.
		const jsonDataBody =
			currentStyleValue === defaultStyleName.current
				? themeData.theme_json_file
				: themeData.styles[ currentStyleValue ]?.body;

		if (
			! jsonDataBody[ topLevelSection ] ||
			Array.isArray( jsonDataBody[ topLevelSection ] )
		) {
			jsonDataBody[ topLevelSection ] = {};
		}

		// Remove any leading commas that might exist.
		if ( selectorString[ 0 ] === '.' ) {
			selectorString = selectorString.substring( 1 );
		}

		// Split the selector string at commas
		const keys = selectorString.split( '.' );

		const modifiedData = setNestedObject(
			value,
			defaultValue,
			[ topLevelSection, ...keys ] // Top level key with the array of keys.
		)( jsonDataBody );

		editTheme(
			// If the current style is not default, save the variation data to the styles array.
			// Otherwise, save the modifiedData to theme.json.
			currentStyleVariationId.value !== defaultStyleName.current
				? {
						...themeData,
						styles: {
							...themeData.styles,
							[ currentStyleVariationId.value ]: {
								...themeData.styles[
									currentStyleVariationId.value
								],
								body: modifiedData,
							},
						},
				  }
				: {
						...themeData,
						theme_json_file: modifiedData,
				  }
		);
	}

	function getThemeJsonValue(
		topLevelSection = 'settings',
		selectorString: string,
		defaultValue?: unknown
	) {
		const currentStyleValue = currentStyleVariationId?.value ?? '';

		// Use theme_json_file if current style variation is default.
		// Otherwise, use the current style variation body.
		const currentStyleVariation =
			currentStyleValue === defaultStyleName.current
				? themeData.theme_json_file
				: themeData?.styles[ currentStyleValue ]?.body ??
				  // Edge case fallback: intermittent crash on switching themes.
				  // Recreate by quoting out fallback, selecting a style variation, then switching themes.
				  themeData.theme_json_file;

		// Remove any leading commas that might exist.
		if ( selectorString[ 0 ] === '.' ) {
			selectorString = selectorString.substring( 1 );
		}

		// Split the selector string at commas
		const keys = selectorString.split( '.' );

		return (
			getNestedValue( currentStyleVariation[ topLevelSection ], keys ) ??
			defaultValue
		);
	}

	function createPattern( patternData: Pattern ) {
		return new Promise( ( resolve ) => {
			const newThemeData = {
				...themeData,
				[ ThemePatternType[ patternData.type ] ]: {
					...themeData[ ThemePatternType[ patternData.type ] ],
					[ patternData.name ]: patternData,
				},
			};

			setThemeData( newThemeData );
			resolve( newThemeData );
		} );
	}

	function deletePattern( patternName: Pattern[ 'name' ] ) {
		if (
			/* eslint-disable no-alert */
			! window.confirm(
				__(
					'Are you sure you want to delete this pattern?',
					'fse-studio'
				)
			)
		) {
			return;
		}

		const {
			[ patternName ]: {},
			...newIncludedPatterns
		} = ( themeData.included_patterns as Patterns ) ?? {};

		setThemeData( {
			...themeData,
			included_patterns: newIncludedPatterns,
		} );
	}

	/**
	 * Allows the user to edit the theme.
	 *
	 * A separate function from setThemeData(), as this sets the 'dirty'
	 * state of the editor.
	 *
	 * @param {Theme} newThemeData
	 */
	function editTheme( newThemeData: Theme ) {
		editorDirty.current = true;
		setThemeData( newThemeData );
	}

	return {
		data: themeData,
		set: editTheme,
		getThemeJsonValue,
		setThemeJsonValue,
		createPattern,
		deletePattern,
		get: getThemeData,
		save: saveThemeData,
		export: exportThemeData,
		saveCompleted,
		isSaving,
		isDirnameTaken,
		fetchInProgress,
	};
}
