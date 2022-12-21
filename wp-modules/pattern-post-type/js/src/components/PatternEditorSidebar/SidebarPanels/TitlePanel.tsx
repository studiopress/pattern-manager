import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import convertToSlug from '../../../../../../app/js/src/utils/convertToSlug';

import { PostMeta } from '../../../types';

type Props = {
	postMeta: PostMeta;
	handleChange: (
		metaKey: 'title',
		newValue: string,
		additionalMeta: { name: string; previousName: string }
	) => void;
};

export function TitlePanel( { postMeta, handleChange }: Props ) {
	const [ nameInput, setNameInput ] = useState( '' );
	const [ nameInputDisabled, setNameInputDisabled ] = useState( true );
	const [ patternNameIsInvalid, setPatternNameIsInvalid ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState(
		__( 'Please enter a unique name.', 'fse-studio' )
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
					'fsestudio_response_is_pattern_title_taken'
				) {
					// Hide or show notice in settings panel on name collision.
					setPatternNameIsInvalid( response.isInvalid );
					setErrorMessage( response.errorMessage );
				}
			},
			false
		);
	}, [] );

	/**
	 * Set nameInput and inputDisabled state when the post is switched.
	 * Mostly intended to catch switching between patterns.
	 */
	useEffect( () => {
		// postMeta is initially returned with empty values until the select request resolves.
		// Try to prevent populating an empty title by only updating if the type is a pattern.
		// Doing it this way should still catch an empty title if the user somehow passes one.
		if ( postMeta?.type === 'pattern' ) {
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
	 *
	 * @param {string} patternTitle
	 */
	function checkPatternTitle( patternTitle ) {
		window.parent.postMessage(
			JSON.stringify( {
				message:
					'fsestudio_pattern_editor_request_is_pattern_title_taken',
				patternTitle,
			} )
		);
	}

	return (
		<PluginDocumentSettingPanel
			name="fsestudio-pattern-editor-pattern-title"
			title={ __( 'Pattern Title', 'fse-studio' ) }
		>
			{ postMeta?.title && (
				<div className="fsestudio-pattern-post-name-input-outer">
					<div onDoubleClick={ () => setNameInputDisabled( false ) }>
						<TextControl
							id="fsestudio-pattern-post-name-input-component"
							disabled={ nameInputDisabled }
							className="fsestudio-pattern-post-name-input"
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
							className="fsestudio-pattern-post-name-button fsestudio-pattern-post-name-button-edit"
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
								? __( 'Edit', 'fse-studio' )
								: __( 'Done', 'fse-studio' ) }
						</button>
					) }

					{ /* Otherwise, show the "Cancel" button to bail out. */ }
					{ patternNameIsInvalid && (
						<button
							type="button"
							className="fsestudio-pattern-post-name-button fsestudio-pattern-post-name-button-cancel"
							aria-label="Pattern Title Cancel Button (click to cancel renaming)"
							onClick={ () => {
								setNameInput( previousPatternName?.current );
								setNameInputDisabled( true );
								setPatternNameIsInvalid( false );
							} }
						>
							{ __( 'Cancel', 'fse-studio' ) }
						</button>
					) }
				</div>
			) }

			<PanelRow className="components-panel__row-fsestudio-pattern-name-error">
				<RichText.Content
					tagName="h4"
					className="components-panel__row-fsestudio-pattern-name-error-inner"
					value={ patternNameIsInvalid && errorMessage }
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}
