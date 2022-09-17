// @ts-check

import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { fsestudio } from '../globals';
import convertToSlug from '../utils/convertToSlug';
import convertToPascalCase from '../utils/convertToPascalCase';
import getHeaders from '../utils/getHeaders';
import { getNestedValue, setNestedObject } from '../utils/nestedObjectUtility';

import useNoticeContext from './useNoticeContext';
import useStyleVariations from '../hooks/useStyleVariations';

/**
 * @typedef {{
 *   id: string,
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
 *   included_patterns?: Record<string, import('../components/PatternPicker').Pattern>,
 *   requires_php: string,
 *   requires_wp: string,
 *   rest_route?: string,
 *   styles: {Object},
 *   tags: string,
 *   template_files: string[],
 *   template_parts: string[],
 *   tested_up_to: string,
 *   text_domain: string,
 *   theme_json_file: string[],
 *   uri: string,
 *   version: string
 * }} Theme
 */

/**
 * @param {string|undefined}                            themeId
 * @param {ReturnType<import('./useThemes').default>}   themes
 * @param {Object}                                      patternEditorIframe
 * @param {Object}                                      templateEditorIframe
 * @param {Object}                                      currentStyleVariationId
 * @param {ReturnType<import('./usePatterns').default>} patterns
 */
export default function useThemeData(
	themeId,
	themes,
	patternEditorIframe,
	templateEditorIframe,
	currentStyleVariationId,
	patterns
) {
	const { setSnackBarValue } = useNoticeContext();
	const [ isSaving, setIsSaving ] = useState( false );
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ saveCompleted, setSaveCompleted ] = useState( true );
	const themeData = themes.themes[ themeId ];
	function setThemeData( newThemeData ) {
		themes.setThemes( {
			...themes.themes,
			[ themeId ]: newThemeData,
		} );
	}

	const [ themeNameIsDefault, setThemeNameIsDefault ] = useState( false );
	const editorDirty = useRef( false );
	const [ siteEditorDirty, setSiteEditorDirty ] = useState( false );
	const [ patternEditorDirty, setPatternEditorDirty ] = useState( false );
	const [ autoSaveTheme, setAutoSaveTheme ] = useState( false );

	const { defaultStyleName } = useStyleVariations();

	useEffect( () => {
		window.addEventListener(
			'message',
			( event ) => {
				if ( event.data === 'fsestudio_site_editor_dirty' ) {
					setSiteEditorDirty( true );
				}
				if ( event.data === 'fsestudio_pattern_editor_dirty' ) {
					setPatternEditorDirty( true );
				}
			},
			false
		);
		// When a pattern or site editor is saved, refresh the theme data.
		window.addEventListener(
			'message',
			( event ) => {
				if ( event.data === 'fsestudio_pattern_editor_save_complete' ) {
					setPatternEditorDirty( false );

					if ( ! siteEditorDirty ) {
						uponSuccessfulSave();
					}
				}
				if ( event.data === 'fsestudio_site_editor_save_complete' ) {
					setSiteEditorDirty( false );

					if ( ! patternEditorDirty ) {
						uponSuccessfulSave();
					}
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
		if ( themeData?.name === '' ) {
			setThemeNameIsDefault( true );
		} else {
			setThemeNameIsDefault( false );
		}

		if ( themeData && autoSaveTheme ) {
			saveThemeData();
		}

		if ( themeId ) {
			themes.setThemes( {
				...themes.themes,
				[ themeId ]: themeData,
			} );
		}
	}, [ themeData ] );

	useEffect( () => {
		if ( themeData?.name ) {
			setThemeData( {
				...themeData,
				dirname: convertToSlug( themeData?.name ),
				namespace: convertToPascalCase( themeData?.name ),
				text_domain: convertToSlug( themeData?.name ),
			} );

			convertToSlug( themeData?.name );
		}
	}, [ themeData?.name ] );

	/**
	 * Warns the user if there are unsaved changes before leaving.
	 *
	 * Forked from Gutenberg: https://github.com/WordPress/gutenberg/blob/5d5e97abd5e082050fdbb88bb1c93f9dbe10a23b/packages/editor/src/components/unsaved-changes-warning/index.js
	 *
	 * @param {Event} event The beforeunload event.
	 */
	function warnIfUnsavedChanges( event ) {
		if ( editorDirty.current || patternEditorDirty || siteEditorDirty ) {
			// returnValue is deprecated, but preventDefault() isn't always enough to prevent navigating away from the page.
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
				resolve();
				return;
			}
			setFetchInProgress( true );
			fetch( fsestudio.apiEndpoints.getThemeEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( {
					themeId,
					preExistingTheme: themeData,
				} ),
			} )
				.then( ( response ) => response.json() )
				.then( ( response ) => {
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
				setThemeNameIsDefault( true );
				resolve();
				return;
			}
			setIsSaving( true );
			setSaveCompleted( false );

			setThemeNameIsDefault( false );
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
				.then( ( data ) => {
					// Send a message to the iframe, telling it to save and refresh.
					if ( patternEditorIframe.current ) {
						patternEditorIframe.current.contentWindow.postMessage(
							JSON.stringify( {
								message: 'fsestudio_save',
							} ),
							'*'
						);

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

					if ( ! patternEditorDirty && ! siteEditorDirty ) {
						uponSuccessfulSave();
					}

					resolve( data );
				} );
		} );
	}

	function uponSuccessfulSave() {
		getThemeData().then( () => {
			if ( autoSaveTheme ) {
				setAutoSaveTheme( false );
			}
			if ( ! autoSaveTheme ) {
				setSnackBarValue(
					__(
						'Theme successfully saved and all files written to theme directory',
						'fsestudio'
					)
				);
			}

			editorDirty.current = false;
			setPatternEditorDirty( false );
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
				.then( ( data ) => {
					window.location.replace( data );
					resolve( data );
				} );
		} );
	}

	function setThemeJsonValue(
		topLevelSection = 'settings',
		selectorString,
		value = null,
		defaultValue = null
	) {
		const currentStyleValue = currentStyleVariationId?.value;

		// Use theme_json_file if current style variation is default.
		// Otherwise, use the current style variation body.
		const jsonDataBody =
			currentStyleValue === defaultStyleName
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

		/**
		 * If the current style is not default, save the variation data to the styles array.
		 * Otherwise, save the modifiedData to theme.json.
		 *
		 * Also, I hate the way prettier wants to format this ternary!
		 */
		const dataToSave =
			currentStyleVariationId.value !== defaultStyleName
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
				  };

		editTheme( dataToSave );
	}

	function getThemeJsonValue(
		topLevelSection = 'settings',
		selectorString,
		defaultValue = undefined
	) {
		const currentStyleValue = currentStyleVariationId?.value ?? '';

		// Use theme_json_file if current style variation is default.
		// Otherwise, use the current style variation body.
		const currentStyleVariation =
			currentStyleValue === defaultStyleName
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

	function createPattern( patternData ) {
		setAutoSaveTheme( true );

		return new Promise( ( resolve ) => {
			let newThemeData = {};
			if ( patternData.type === 'pattern' ) {
				newThemeData = {
					...themeData,
					included_patterns: {
						...themeData.included_patterns,
						[ patternData.name ]: patternData,
					},
				};
			}
			if ( patternData.type === 'template' ) {
				newThemeData = {
					...themeData,
					template_files: {
						...themeData.template_files,
						[ patternData.name ]: patternData,
					},
				};
			}
			if ( patternData.type === 'template_part' ) {
				newThemeData = {
					...themeData,
					template_parts: {
						...themeData.template_parts,
						[ patternData.name ]: patternData,
					},
				};
			}
			setThemeData( newThemeData );
			resolve( newThemeData );
		} );
	}

	/** @param {string} patternName */
	function deletePattern( patternName ) {
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
		} = themeData.included_patterns ?? {};

		setAutoSaveTheme( true );
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
	function editTheme( newThemeData ) {
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
		fetchInProgress,
		themeNameIsDefault,
	};
}
