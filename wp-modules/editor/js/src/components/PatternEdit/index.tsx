import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
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
				<PatternPicker setAttributes={ setAttributes } />
			</Panel>
		</InspectorControls>
	);
}

export default function PatternEdit( {
	attributes,
	setAttributes,
}: PatternEditProps ) {
	const blockProps = useBlockProps();
	const splitSlug = attributes?.slug?.split( '/' );
	const pattern =
		patternManager.patterns[ splitSlug?.[ splitSlug?.length - 1 ] ];
	const [ isModalOpen, setModalOpen ] = useState( false );

	return pattern ? (
		<div
			{ ...blockProps }
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
					right: '10px',
					top: '10px',
					position: 'absolute',
					height: '25px',
					width: '25px',
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
						width: '15px',
					} }
				/>
			</div>
			<ServerSideRender
				block="core/pattern"
				attributes={ attributes }
				httpMethod="POST"
				urlQueryArgs={ { is_pm_pattern: true } }
			/>
		</div>
	) : (
		<div { ...blockProps }>
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
		</div>
	);
}
