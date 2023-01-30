import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import convertToSlug from '../../../utils/convertToSlug';

import type { BaseSidebarProps } from '../types';
import type { Patterns } from '../../../types';
import { patternManager } from '../../../globals';

export default function TitlePanel( {
	postMeta,
	handleChange,
}: BaseSidebarProps ) {
	const pattern =
		patternManager.patterns?.[
			new URL( location.href ).searchParams.get( 'name' )
		];
	const [ nameInput, setNameInput ] = useState( pattern.title );
	const [ patternNameIsInvalid, setPatternNameIsInvalid ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState(
		__( 'Please enter a unique name.', 'pattern-manager' )
	);

	const previousPatternName = useRef( '' );
	function doesNameExist( patternTitle: string, patterns: Patterns ) {
		const newSlug = convertToSlug( patternTitle );
		return Object.values( patterns ).some( ( ownPattern ) => {
			return newSlug === ownPattern.slug && postMeta.slug !== newSlug;
		} );
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
						if ( doesNameExist( value, patternManager.patterns ) ) {
							setPatternNameIsInvalid( true );
							setErrorMessage( errorMessage );
						}
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
