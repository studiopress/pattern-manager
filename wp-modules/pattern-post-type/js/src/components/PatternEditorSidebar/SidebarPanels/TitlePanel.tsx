import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import { convertToSlug } from '@pattern-manager/js-utils';

import type { BaseSidebarProps } from '../types';

export default function TitlePanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
	const [ nameInput, setNameInput ] = useState( '' );
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
	 * Set nameInput and inputDisabled state when postMeta is loaded.
	 * Also intended to catch switching between patterns.
	 */
	useEffect( () => {
		if ( postMeta.title ) {
			setNameInput( postMeta.title );
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
				<TextControl
					id="patternmanager-pattern-post-name-input-component"
					aria-label="Pattern Title Name Input (used for renaming the pattern)"
					value={ nameInput }
					onChange={ ( value ) => {
						setNameInput( value );
						// Validate the nameInput to provide immediate feedback.
						checkPatternTitle( value );
					} }
					onBlur={ () => {
						// Do not allow an empty title to be saved to postMeta.
						if ( ! nameInput.length ) {
							setNameInput( previousPatternName.current );
							setPatternNameIsInvalid( false );
							return;
						}

						handleChange( 'title', nameInput, {
							name: convertToSlug( nameInput ),
							previousName: previousPatternName.current,
						} );
					} }
				/>
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
