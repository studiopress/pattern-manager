import { parse } from '@wordpress/blocks';
import { InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../../globals';
import convertParsedBlocksToBlockTemplate from '../../utils/convertParsedBlocksToBlockTemplate';
import PatternPreview from '../../../../../app/js/src/components/PatternPreview';
import { Panel, PanelBody } from '@wordpress/components';
import useSavedPostData from '../../hooks/useSavedPostData';

export function PatternEdit( { attributes, setAttributes } ) {
	const patternSlugParts = attributes?.slug.split( '/' );
	const patternSlug = patternSlugParts[ patternSlugParts.length - 1 ];
	const pattern = patternManager?.patterns[ patternSlug ];
	const parentPatternBeingEditedData = useSavedPostData();

	function renderPatternPicker() {
		const renderedPatternList = [];

		for ( const patternName in patternManager?.patterns ) {
			if ( patternName === parentPatternBeingEditedData.currentName ) {
				// Don't allow a pattern to be inserted into itself;
				continue;
			}

			renderedPatternList.push(
				<button
					style={ { width: '100%', marginBottom: '10px' } }
					className="button"
					key={ patternManager?.patterns[ patternName ].name }
					onClick={ () => {
						setAttributes( {
							slug: patternManager?.patterns[ patternName ].name,
						} );
					} }
				>
					{ patternName }
					<PatternPreview
						url={
							patternManager.siteUrl +
							'?pm_pattern_preview=' +
							patternManager?.patterns[ patternName ].name
						}
						viewportWidth={
							patternManager?.patterns[ patternName ]
								.viewportWidth
						}
					/>
				</button>
			);
		}

		return <div>{ renderedPatternList }</div>;
	}

	if ( ! pattern ) {
		return (
			<div>
				<InspectorControls>
					<Panel header="PM Pattern Settings">
						<PanelBody title="Pattern To Use" initialOpen={ true }>
							{ renderPatternPicker() }
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

	const parsedBlocks = parse( pattern?.content );
	const blockTemplate = convertParsedBlocksToBlockTemplate(
		parsedBlocks,
		[]
	);

	return (
		<div
			style={ {
				position: 'relative',
			} }
		>
			<InspectorControls>
				<Panel header="PM Pattern Settings">
					<PanelBody title="Pattern To Use" initialOpen={ true }>
						{ renderPatternPicker() }
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
					<a className="button" href={ pattern?.editorLink }>
						{ __( 'Edit this pattern', 'pattern-manager' ) }
					</a>
				</div>
			</div>
			<div
				style={ { position: 'relative', top: '0', left: '0' } }
				className="pm-pattern-background"
			>
				<InnerBlocks template={ blockTemplate } templateLock="all" />
			</div>
		</div>
	);
}
