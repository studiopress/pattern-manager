/* eslint-disable jsdoc/valid-types */

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
 * @param {import('../types').InitialContext['currentThemeId']['value']} themeId
 * @param {import('../types').InitialContext['themes']}                  themes
 * @param {import('../types').InitialContext['patternEditorIframe']}     patternEditorIframe
 * @param {import('../types').InitialContext['templateEditorIframe']}    templateEditorIframe
 * @param {import('../types').InitialContext['currentStyleVariationId']} currentStyleVariationId
 * @param {ReturnType<import('./usePatterns').default>}                  patterns
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

	/** @param {import('../types').Theme} newThemeData */
	function setThemeData( newThemeData ) {
		const derivedThemeData =
			newThemeData.name !== themeData.name
				? {
						dirname: convertToSlug( newThemeData.name ),
						namespace: convertToPascalCase( newThemeData.name ),
						text_domain: convertToSlug( newThemeData.name ),
				  }
				: {};

		themes.setThemes( {
			...themes.themes,
			[ themeId ]: {
				...newThemeData,
				...derivedThemeData,
			},
		} );
	}

	const editorDirty = useRef( false );
	const [ siteEditorDirty, setSiteEditorDirty ] = useState( false );
	const [ requestThemeRefresh, setRequestThemeRefresh ] = useState( false );

	const { defaultStyleName } = useStyleVariations();

	/** @return {boolean} Whether another theme also has the current theme name. */
	function isNameTaken() {
		return (
			!! themeData.name &&
			Object.entries( themes.themes )
				.filter( ( [ id ] ) => {
					return id !== themeId;
				} )
				.some( ( [ , theme ] ) => {
					return theme.name === themeData.name;
				} )
		);
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
	function warnIfUnsavedChanges( event ) {
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
				resolve();
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
				resolve();
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
				.then( ( data ) => {
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
				} );
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

	/** @param {import('../types').Pattern} patternData */
	function createPattern( patternData ) {
		return new Promise( ( resolve ) => {
			let newThemeData;
			if ( patternData.type === 'pattern' ) {
				newThemeData = {
					...themeData,
					included_patterns: {
						...themeData.included_patterns,
						[ patternData.name ]: patternData,
					},
				};
			} else if ( patternData.type === 'template' ) {
				newThemeData = {
					...themeData,
					template_files: {
						...themeData.template_files,
						[ patternData.name ]: patternData,
					},
				};
			} else if ( patternData.type === 'template_part' ) {
				newThemeData = {
					...themeData,
					template_parts: {
						...themeData.template_parts,
						[ patternData.name ]: patternData,
					},
				};
			} else {
				return;
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
	 * @param {import('../types').Theme} newThemeData
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
		isNameTaken,
		fetchInProgress,
	};
}
