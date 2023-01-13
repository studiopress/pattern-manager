import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import convertToSlug from '../../../../../../app/js/src/utils/convertToSlug';

import type { BaseSidebarProps } from '../types';

export default function TitlePanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
	const [ nameInput, setNameInput ] = useState( '' );
	const [ nameInputDisabled, setNameInputDisabled ] = useState( true );
	const [ patternNameIsInvalid, setPatternNameIsInvalid ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState(
		__( 'Please enter a unique name.', 'pattern-manager' )
	);

	const previousPatternName = useRef( '' );

	/**
	 * Listener to catch name collision for patterns as they are renamed.
	 * The targeted response should populate `errorMessage` and `patternNameIsInvalid`.
	 */
	useEffect( () => {
		window.addEventListener(
			'message',
			( event ) => {
				const response = JSON.parse( event.data );
				if (
					response.message ===
					'patternmanager_response_is_pattern_title_taken'
				) {
					// Hide or show notice in settings panel on name collision.
					setPatternNameIsInvalid( response.isInvalid );
					setErrorMessage( response.errorMessage );
				}
			},
			false
		);
	}, [] );

	/*
	 * Set nameInput and inputDisabled state when the post is switched.
	 * Mostly intended to catch switching between patterns.
	 */
	useEffect( () => {
		if ( postMeta.title ) {
			setNameInput( postMeta.title );
			setNameInputDisabled( true );
			// Validate the initial postMeta title.
			checkPatternTitle( postMeta.title );

			previousPatternName.current = postMeta.title;
		}
	}, [ postMeta.title ] );

	/**
	 * Fire off a postMessage to validate pattern title.
	 * String is validated in PatternEditor component.
	 */
	function checkPatternTitle( patternTitle: string ) {
		window.parent.postMessage(
			JSON.stringify( {
				message: 'pm_pattern_editor_request_is_pattern_title_taken',
				patternTitle,
			} )
		);
	}

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-title"
			title={ __( 'Pattern Title', 'pattern-manager' ) }
		>
			{ postMeta?.title && (
				<div className="patternmanager-pattern-post-name-input-outer">
					<div onDoubleClick={ () => setNameInputDisabled( false ) }>
						<TextControl
							id="patternmanager-pattern-post-name-input-component"
							disabled={ nameInputDisabled }
							className="patternmanager-pattern-post-name-input"
							aria-label="Pattern Title Name Input (used for renaming the pattern)"
							value={ nameInput }
							onChange={ ( value ) => {
								setNameInput( value );
								// Validate the nameInput to provide immediate feedback.
								checkPatternTitle( value );
							} }
						/>
					</div>

					{ /* Conditionally render the "Edit" button for pattern renaming. */ }
					{ /* If the pattern name is valid, show the "Edit" or "Done" option. */ }
					{ ! patternNameIsInvalid && (
						<button
							type="button"
							className="patternmanager-pattern-post-name-button patternmanager-pattern-post-name-button-edit"
							aria-label="Pattern Title Edit Button (click to rename the pattern title)"
							onClick={ () => {
								if (
									! nameInputDisabled &&
									nameInput.toLowerCase() !==
										previousPatternName.current.toLowerCase()
								) {
									handleChange( 'title', nameInput, {
										name: convertToSlug( nameInput ),
										previousName:
											previousPatternName.current,
									} );
								}

								setNameInputDisabled( ! nameInputDisabled );
							} }
						>
							{ nameInputDisabled
								? __( 'Edit', 'pattern-manager' )
								: __( 'Done', 'pattern-manager' ) }
						</button>
					) }

					{ /* Otherwise, show the "Cancel" button to bail out. */ }
					{ patternNameIsInvalid && (
						<button
							type="button"
							className="patternmanager-pattern-post-name-button patternmanager-pattern-post-name-button-cancel"
							aria-label="Pattern Title Cancel Button (click to cancel renaming)"
							onClick={ () => {
								setNameInput( previousPatternName?.current );
								setNameInputDisabled( true );
								setPatternNameIsInvalid( false );
							} }
						>
							{ __( 'Cancel', 'pattern-manager' ) }
						</button>
					) }
				</div>
			) }

			<PanelRow className="components-panel__row-patternmanager-pattern-name-error">
				<RichText.Content
					tagName="h4"
					className="components-panel__row-patternmanager-pattern-name-error-inner"
					value={ patternNameIsInvalid && errorMessage }
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}
