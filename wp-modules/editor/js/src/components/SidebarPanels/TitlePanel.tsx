import { speak } from '@wordpress/a11y';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import convertToSlug from '../../utils/convertToSlug';

import type { AdditionalSidebarProps, BaseSidebarProps } from './types';
import type { Pattern } from '../../types';

function isTitleTaken(
	patternTitle: string,
	currentName: string,
	patternNames: Array< Pattern[ 'slug' ] >
) {
	const newSlug = convertToSlug( patternTitle );
	return patternNames.includes( newSlug ) && newSlug !== currentName;
}

export default function TitlePanel( {
	currentName,
	errorMessage,
	patternNames,
	title,
	handleChange,
	setErrorMessage,
}: BaseSidebarProps< 'title' > &
	AdditionalSidebarProps<
		'currentName' | 'errorMessage' | 'patternNames' | 'setErrorMessage'
	> ) {
	const { editPost, lockPostSaving, unlockPostSaving } =
		useDispatch( 'core/editor' );

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
				onChange={ ( newTitle: typeof title ) => {
					editPost( { title: newTitle } );
					handleChange( 'slug', convertToSlug( newTitle ) );

					if ( ! newTitle ) {
						lockPostSaving();
						const newErrorMessage = __(
							'Please enter a title.',
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
