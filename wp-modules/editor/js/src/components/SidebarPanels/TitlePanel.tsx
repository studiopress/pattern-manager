import { speak } from '@wordpress/a11y';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';
import { useState } from '@wordpress/element';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import convertToSlug from '../../utils/convertToSlug';

import type { BaseSidebarProps } from './types';
import type { Pattern, PostMeta } from '../../types';
import usePatternData from '../../hooks/usePatternData';

function isTitleTaken(
	patternTitle: string,
	currentSlug: string,
	patternNames: Array< Pattern[ 'name' ] >
) {
	const newSlug = convertToSlug( patternTitle );
	return patternNames.includes( newSlug ) && newSlug !== currentSlug;
}

export default function TitlePanel( {
	handleChange,
	patternNames,
	postMeta,
	title,
}: BaseSidebarProps & {
	patternNames: Array< Pattern[ 'name' ] >;
	title: string;
} ) {
	const { editPost, lockPostSaving, unlockPostSaving } =
		useDispatch( editorStore );
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
				value={ title }
				onChange={ ( newTitle: PostMeta[ 'title' ] ) => {
					editPost( { title: newTitle } );
					handleChange( 'name', convertToSlug( newTitle ) );

					if ( ! newTitle ) {
						lockPostSaving();
						const newErrorMessage = __(
							'Please enter a title.',
							'pattern-manager'
						);
						speak( newErrorMessage, 'assertive' );
						setErrorMessage( newErrorMessage );
					} else if (
						isTitleTaken( newTitle, postMeta.slug, patternNames )
					) {
						lockPostSaving();
						const newErrorMessage = __(
							'Please enter a unique title.',
							'pattern-manager'
						);
						speak( newErrorMessage, 'assertive' );
						setErrorMessage( newErrorMessage );
					} else {
						unlockPostSaving();
						setErrorMessage( '' );
					}
				} }
			/>
			<PanelRow className="components-panel__row-patternmanager-pattern-name-error">
				<RichText.Content
					tagName="span"
					className="components-panel__row-patternmanager-pattern-name-error-inner"
					value={ errorMessage }
				/>
			</PanelRow>
		</PluginDocumentSettingPanel>
	);
}
