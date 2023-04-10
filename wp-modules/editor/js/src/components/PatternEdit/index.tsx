import { parse } from '@wordpress/blocks';
import { InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../../globals';
import convertParsedBlocksToBlockTemplate from '../../utils/convertParsedBlocksToBlockTemplate';
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
	const parentPatternBeingEditedData = useSavedPostData();

	return (
		<div>
			{ Object.entries( patternManager.patterns ).map(
				( [ patternName, pattern ] ) => {
					return patternName ===
						parentPatternBeingEditedData.currentName ? null : (
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

export function PatternEdit( { attributes, setAttributes }: PatternEditProps ) {
	const pattern =
		patternManager.patterns[
			attributes?.slug.split( '/' )?.findLast( Boolean )
		];

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
			<div
				className="pm-pattern-overlay"
				style={ {
					display: 'grid',
					width: '100%',
					height: '100%',
					alignItems: 'center',
					justifyItems: 'center',
					zIndex: '2',
					position: 'absolute',
					color: '#FFF',
					backgroundColor: 'rgb(255 0 0 / 89%)',
				} }
			>
				<div>
					<div>{ __( 'Pattern name:', 'pattern-manager' ) }</div>
					<div>{ attributes?.slug }</div>
					<a className="button" href={ pattern.editorLink }>
						{ __( 'Edit this pattern', 'pattern-manager' ) }
					</a>
				</div>
			</div>
			<div
				style={ { position: 'relative', top: '0', left: '0' } }
				className="pm-pattern-background"
			>
				<InnerBlocks
					template={ convertParsedBlocksToBlockTemplate(
						parse( pattern.content )
					) }
					templateLock="all"
				/>
			</div>
		</div>
	) : (
		<div>
			<InspectorControls>
				<Panel header="PM Pattern Settings">
					<PanelBody title="Pattern To Use" initialOpen={ true }>
						<PatternPicker setAttributes={ setAttributes } />
					</PanelBody>
				</Panel>
			</InspectorControls>
			{ __(
				'Selected pattern Not found in the theme',
				'pattern-manager'
			) }
		</div>
	);
}
