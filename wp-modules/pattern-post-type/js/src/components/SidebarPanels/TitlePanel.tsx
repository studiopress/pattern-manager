import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import convertToSlug from '../../utils/convertToSlug';
import { patternManager } from '../../globals';

import type { BaseSidebarProps } from './types';
import type { Pattern } from '../../types';

function doesTitleExist(
	patternTitle: string,
	currentSlug: string,
	patternNames: Array< Pattern[ 'name' ] >
) {
	const newSlug = convertToSlug( patternTitle );
	return patternNames.includes( newSlug ) && newSlug !== currentSlug;
}

export default function TitlePanel( {
	postMeta,
	handleChange,
	patternNames,
}: BaseSidebarProps & { patternNames: Array< Pattern[ 'name' ] > } ) {
	const [ errorMessage, setErrorMessage ] = useState( '' );

	return (
		<PluginDocumentSettingPanel
			name="patternmanager-pattern-editor-pattern-title"
			title={ __( 'Pattern Title', 'pattern-manager' ) }
		>
			<TextControl
				id="patternmanager-pattern-post-name-input-component"
				aria-label={ __(
					'Pattern Title Name Input (used for renaming the pattern)',
					'pattern-manager'
				) }
				value={ postMeta.title }
				onChange={ ( newValue: string ) => {
					handleChange( 'title', newValue, {
						name: convertToSlug( newValue ),
					} );

					if ( ! newValue ) {
						setErrorMessage(
							__( 'Please enter a title.', 'pattern-manager' )
						);
					} else if (
						doesTitleExist( newValue, postMeta.slug, patternNames )
					) {
						setErrorMessage(
							__(
								'Please enter a unique title.',
								'pattern-manager'
							)
						);
					} else {
						setErrorMessage( '' );
					}
				} }
			/>
			<PanelRow className="components-panel__row-patternmanager-pattern-name-error">
				<RichText.Content
					tagName="h4"
					className="components-panel__row-patternmanager-pattern-name-error-inner"
					value={ errorMessage }
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}
