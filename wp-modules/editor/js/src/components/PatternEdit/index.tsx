import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	Modal,
	Panel,
	PanelBody,
	Placeholder,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, image, lock } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import { patternManager } from '../../globals';
import Patterns from '../../../../../app/js/src/components/Patterns';
import type { Dispatch, SetStateAction } from 'react';
import type { Pattern } from '../../types';

type Attributes = {
	slug?: string;
};

type SetAttributes = ( attributes: Attributes ) => void;

type PatternInspectorProps = {
	pattern?: Pattern;
};

type PatternEditProps = {
	attributes: Attributes;
	setAttributes: SetAttributes;
};

function PatternInspector( { pattern }: PatternInspectorProps ) {
	return (
		<InspectorControls>
			<Panel>
				<PanelBody
					title={ __( 'Pattern', 'pattern-manager' ) }
					initialOpen={ true }
				>
					{ __(
						'This is a pattern placeholder, used for building layouts with pattern tags. To edit the pattern, click the button below.',
						'pattern-manager'
					) }
					{ pattern ? (
						<a
							target="_blank"
							className="components-button is-secondary"
							style={ { marginTop: '10px' } }
							href={ pattern.editorLink }
						>
							{ __( 'Edit This Pattern', 'pattern-manager' ) }
						</a>
					) : null }
				</PanelBody>
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
	const blockProps = useBlockProps( {
		className: pattern ? 'alignfull' : 'is-layout-constrained',
	} );

	return (
		<>
			{ isModalOpen && (
				<Modal onRequestClose={ () => setModalOpen( false ) }>
					<Patterns
						onSelectPattern={ (
							patternName: Pattern[ 'name' ]
						) => {
							setAttributes( {
								slug: patternName,
							} );
							setModalOpen( false );
						} }
						patternCategories={ patternManager.patternCategories }
						patterns={ patternManager.patterns }
						siteUrl={ patternManager.siteUrl }
					/>
				</Modal>
			) }
			{ pattern ? (
				<div
					{ ...blockProps }
					style={ {
						position: 'relative',
					} }
				>
					<PatternInspector pattern={ pattern } />
					<BlockControls group="block">
						<Button onClick={ () => setModalOpen( true ) }>
							{ __( 'Replace', 'pattern-manager' ) }
						</Button>
					</BlockControls>
					<div
						style={ {
							right: '10px',
							top: '10px',
							position: 'absolute',
							height: '35px',
							width: '35px',
							background: '#fff',
							zIndex: '20',
							borderRadius: '500px',
							display: 'flex',
							gap: '10px',
							alignItems: 'center',
							fontFamily:
								'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
							fontSize: '16px',
							padding: '5px',
							border: 'solid 1px rgba(0,0,0,.1)',
						} }
					>
						<Icon
							icon={ lock }
							style={ {
								width: '25px',
							} }
						/>
					</div>
					<ServerSideRender
						block="core/pattern"
						className="pm-pattern-container"
						attributes={ attributes }
						httpMethod="POST"
						urlQueryArgs={ { is_pm_pattern: true } }
					/>
				</div>
			) : (
				<div { ...blockProps }>
					<PatternInspector />
					<Placeholder
						icon={ image }
						label={ __(
							'Pattern Manager Block',
							'pattern-manager'
						) }
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
					</Placeholder>
				</div>
			) }
		</>
	);
}
