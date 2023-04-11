import { InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { parse } from '@wordpress/blocks';
import {
	Button,
	Disabled,
	Modal,
	Panel,
	PanelBody,
	Placeholder,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, image, lock } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../../globals';
import convertBlocksToTemplate from '../../utils/convertBlocksToTemplate';
import PatternPreview from '../../../../../app/js/src/components/PatternPreview';
import useSavedPostData from '../../hooks/useSavedPostData';

type Attributes = {
	slug?: string;
};

type SetAttributes = ( attributes: Attributes ) => void;

type PatternPickerProps = {
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

export default function PatternEdit( {
	attributes,
	setAttributes,
}: PatternEditProps ) {
	const pattern =
		patternManager.patterns[
			attributes?.slug?.split( '/' )?.findLast( Boolean )
		];
	const [ isModalOpen, setModalOpen ] = useState( false );

	return pattern ? (
		<div
			style={ {
				position: 'relative',
			} }
		>
			<InspectorControls>
				<Panel header="PM Pattern Settings">
					<PanelBody title="Pattern To Use" initialOpen={ true }>
						<PatternPicker setAttributes={ setAttributes } />
					</PanelBody>
				</Panel>
			</InspectorControls>
			<Disabled>
				<div
					className="your-class"
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
					template={ convertBlocksToTemplate(
						parse( pattern.content )
					) }
					templateLock="all"
				/>
			</Disabled>
		</div>
	) : (
		<>
			<InspectorControls>
				<Panel header="PM Pattern Settings">
					<PanelBody title="Pattern To Use" initialOpen={ true }>
						<PatternPicker setAttributes={ setAttributes } />
					</PanelBody>
				</Panel>
			</InspectorControls>
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
							'The PatternPreview will be here',
							'pattern-preview'
						) }
					</Modal>
				) }
			</Placeholder>
		</>
	);
}
