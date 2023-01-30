import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import convertToSlug from '../../utils/convertToSlug';

import type { BaseSidebarProps } from './types';
import type { Patterns } from '../../types';

function doesTitleExist( patternTitle: string, patterns: Patterns ) {
	const newSlug = convertToSlug( patternTitle );
	return Object.values( patterns ).some( ( ownPattern ) => {
		return newSlug === ownPattern.slug;
	} );
}

export default function TitlePanel( {
	postMeta,
	handleChange,
	patternName,
	patterns,
	setPatternName,
}: BaseSidebarProps & {
	patternName: string;
	patterns: Patterns;
	setPatternName: ( newName: string ) => void;
} ) {
	const [ patternNameIsInvalid, setPatternNameIsInvalid ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState(
		__( 'Please enter a unique name.', 'pattern-manager' )
	);
	const [ titleInput, setTitleInput ] = useState( patternName );
	const previousPatternName = useRef( '' );

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-title"
			title={ __( 'Pattern Title', 'pattern-manager' ) }
		>
			{ postMeta?.title && (
				<TextControl
					id="patternmanager-pattern-post-name-input-component"
					aria-label={ __(
						'Pattern Title Name Input (used for renaming the pattern)',
						'pattern-manager'
					) }
					value={ titleInput }
					onChange={ ( value ) => {
						setTitleInput( value );

						if ( doesTitleExist( value, patterns ) ) {
							setPatternNameIsInvalid( true );
							setErrorMessage( errorMessage );
						} else {
							setPatternName( value );
							setPatternNameIsInvalid( false );
							setErrorMessage( '' );
						}
					} }
					onBlur={ () => {
						// Do not allow an empty title to be saved to postMeta.
						if ( ! patternName.length ) {
							setPatternName( previousPatternName.current );
							setPatternNameIsInvalid( false );
							return;
						}

						handleChange( 'title', patternName, {
							name: convertToSlug( patternName ),
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
