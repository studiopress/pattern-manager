import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternmanager } from '../globals';
import getHeaders from '../utils/getHeaders';

import useNoticeContext from './useNoticeContext';
import usePatterns from './usePatterns';

import type { InitialContext, InitialPatternManager, Pattern, Patterns, Theme } from '../types';
import { ThemePatternType } from '../enums';

export default function useThemeData(
	theme: InitialPatternManager[ 'theme' ],
	patternEditorIframe: InitialContext[ 'patternEditorIframe' ],
	templateEditorIframe: InitialContext[ 'templateEditorIframe' ],
	patterns: ReturnType< typeof usePatterns >
) {
	const { setSnackBarValue } = useNoticeContext();
	const [ isSaving, setIsSaving ] = useState( false );
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ themeData, setThemeData ] = useState( theme );

	const editorDirty = useRef( false );
	const [ siteEditorDirty, setSiteEditorDirty ] = useState( false );
	const [ requestThemeRefresh, setRequestThemeRefresh ] = useState( false );

	useEffect( () => {
		window.addEventListener(
			'message',
			( event ) => {
				if ( event.data === 'patternmanager_site_editor_dirty' ) {
					setSiteEditorDirty( true );
				}
			},
			false
		);
		// When a pattern or site editor is saved, refresh the theme data.
		window.addEventListener(
			'message',
			( event ) => {
				if (
					event.data === 'patternmanager_site_editor_save_complete'
				) {
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
				// We have to do this outside the pm_pattern_editor_save_complete listener because currentTheme is stale there.
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
				'pattern-manager'
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
			fetch( patternmanager.apiEndpoints.getThemeEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( {
					themeId: themes.themes[ themeId ].dirname,
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
				alert('You need to change your theme name before saving');
				/* eslint-enable */
				return;
			}
			setIsSaving( true );

			fetch( patternmanager.apiEndpoints.saveThemeEndpoint, {
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
										message:
											'patternmanager_themejson_changed',
									} ),
									'*'
								);
							}
						}

						if ( templateEditorIframe.current ) {
							templateEditorIframe.current.contentWindow.postMessage(
								JSON.stringify( {
									message: 'patternmanager_save',
								} ),
								'*'
							);

							if ( data.themeJsonModified ) {
								templateEditorIframe.current.contentWindow.postMessage(
									JSON.stringify( {
										message:
											'patternmanager_themejson_changed',
									} ),
									'*'
								);
							} else if ( data.styleJsonModified ) {
								templateEditorIframe.current.contentWindow.postMessage(
									JSON.stringify( {
										message:
											'patternmanager_stylejson_changed',
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
					'pattern-manager'
				)
			);

			editorDirty.current = false;
			setSiteEditorDirty( false );
			setIsSaving( false );
			patterns?.reloadPatternPreviews();
		} );
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
					'pattern-manager'
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
		createPattern,
		deletePattern,
		save: saveThemeData,
		isSaving,
		fetchInProgress,
	};
}
