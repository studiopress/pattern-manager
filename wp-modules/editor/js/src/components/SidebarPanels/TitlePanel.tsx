import { speak } from '@wordpress/a11y';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { PanelRow, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

import toKebabCase from '../../utils/toKebabCase';
import stripIllegalChars from '../../utils/stripIllegalChars';

import type { AdditionalSidebarProps, BaseSidebarProps } from './types';
import type { Pattern } from '../../types';

function isTitleTaken(
	patternTitle: string,
	currentName: string,
	patternNames: Array< Pattern[ 'name' ] >
) {
	const newName = toKebabCase( stripIllegalChars( patternTitle ) );
	return patternNames.includes( newName ) && newName !== currentName;
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
					handleChange(
						'name',
						toKebabCase( stripIllegalChars( newTitle ) )
					);

					if ( ! newTitle ) {
						lockPostSaving();
						const newErrorMessage = __(
							'Please enter a title.',
							'pattern-manager'
						);
						speak( newErrorMessage, 'assertive' );
						setErrorMessage( newErrorMessage );
					} else if (
						isTitleTaken( newTitle, currentName, patternNames )
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
