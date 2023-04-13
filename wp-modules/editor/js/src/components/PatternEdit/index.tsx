import { InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import {
	Button,
	Modal,
	Panel,
	PanelBody,
	Placeholder,
} from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import { Icon, image, lock } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../../globals';
import convertBlocksToTemplate from '../../utils/convertBlocksToTemplate';
import PatternPreview from '../../../../../app/js/src/components/PatternPreview';
import useSavedPostData from '../../hooks/useSavedPostData';
import type { Pattern } from '../../types';

type Attributes = {
	slug?: string;
};

type SetAttributes = ( attributes: Attributes ) => void;

type PatternPickerProps = {
	setAttributes: SetAttributes;
};

type PatternInspectorProps = {
	pattern?: Pattern;
	setAttributes: SetAttributes;
};

type PatternEditProps = {
	attributes: Attributes;
	setAttributes: SetAttributes;
};

function PatternPicker( { setAttributes }: PatternPickerProps ) {
	const parentPatternBeingEdited = useSavedPostData();

	return (
		<div>
			{ Object.entries( patternManager.patterns ).map(
				( [ patternName, pattern ] ) => {
					return patternName ===
						parentPatternBeingEdited.currentName ? null : (
						<button
							style={ { width: '100%', marginBottom: '10px' } }
							className="button"
							key={ pattern.name }
							onClick={ () => {
								setAttributes( {
									slug: pattern.name,
								} );
							} }
						>
							{ patternName }
							<PatternPreview
								url={
									patternManager.siteUrl +
									'?pm_pattern_preview=' +
									pattern.name
								}
								viewportWidth={ pattern.viewportWidth }
							/>
						</button>
					);
				}
			) }
		</div>
	);
}

function PatternInspector( { pattern, setAttributes }: PatternInspectorProps ) {
	return (
		<InspectorControls>
			<Panel header={ __( 'PM Pattern Settings', 'pattern-manager' ) }>
				<PanelBody
					title={ __( 'Pattern To Use', 'pattern-manager' ) }
					initialOpen={ true }
				>
					{ __(
						'This pattern is a placeholder.',
						'pattern-manager'
					) }
					&nbsp;
					{ pattern
						? createInterpolateElement(
								__(
									'You can edit it <span></span>.',
									'pattern-manager'
								),
								{
									span: (
										<a href={ pattern.editorLink }>
											{ __( 'here', 'pattern-manager' ) }
										</a>
									),
								}
						  )
						: null }
				</PanelBody>
				<PatternPicker setAttributes={ setAttributes } />
			</Panel>
		</InspectorControls>
	);
}

export default function PatternEdit( {
	attributes,
	setAttributes,
}: PatternEditProps ) {
	const splitSlug = attributes?.slug?.split( '/' );
	const pattern =
		patternManager.patterns[ splitSlug?.[ splitSlug?.length - 1 ] ];
	const [ isModalOpen, setModalOpen ] = useState( false );

	return pattern ? (
		<div
			style={ {
				position: 'relative',
			} }
		>
			<PatternInspector
				pattern={ pattern }
				setAttributes={ setAttributes }
			/>
			<div
				style={ {
					width: '100%',
					height: '100%',
					position: 'absolute',
				} }
			>
				<Icon
					icon={ lock }
					style={ {
						position: 'relative',
						left: '100%',
					} }
				/>
			</div>
			<InnerBlocks
				template={ convertBlocksToTemplate( parse( pattern.content ) ) }
				templateLock="all"
			/>
		</div>
	) : (
		<>
			<PatternInspector setAttributes={ setAttributes } />
			<Placeholder
				icon={ image }
				label={ __( 'Pattern Manager Block', 'pattern-manager' ) }
				instructions={ __(
					'Build a multi-pattern layout with available patterns',
					'pattern-manager'
				) }
			>
				<Button
					onClick={ () => {
						setModalOpen( ! isModalOpen );
					} }
					variant="primary"
				>
					{ __( 'Select a Pattern', 'pattern-manager' ) }
				</Button>
				{ isModalOpen && (
					<Modal onRequestClose={ () => setModalOpen( false ) }>
						{ __(
							'The Patterns component will be here. For now, select a pattern in the Inspector.',
							'pattern-preview'
						) }
					</Modal>
				) }
			</Placeholder>
		</>
	);
}
