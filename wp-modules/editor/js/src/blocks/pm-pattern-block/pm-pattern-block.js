import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

// This block takes the place of the core pattern block. <!-- wp:pattern {"slug":"frost/query"} /-->
registerBlockType( 'pattern-manager/pattern', {
	title: __( 'PM Pattern Block', 'pattern-manager' ),
	icon: '',
	category: 'common',
	apiVersion: 1,

	attributes: {
		slug: {
			type: 'string',
			default: '',
		},
	},

	edit( { attributes, setAttributes } ) {
		return (
			<div
				style={ {
					backgroundColor: '#000',
					color: '#fff',
					padding: '10px',
				} }
			>
				<InspectorControls>
					<input
						type="text"
						value={ attributes?.slug }
						onChange={ ( event ) => {
							setAttributes( { slug: event.target.value } );
						} }
					/>
				</InspectorControls>
				<div>{ __( 'Pattern name:', 'pattern-manager' ) }</div>
				<div>{ attributes?.slug }</div>
				<a
					className="button"
					href="LINK TO EDIT THIS PATTERN GOES HERE"
				>
					{ __( 'Edit this pattern', 'pattern-manager' ) }
				</a>
			</div>
		);
	},

	save() {
		return '';
	},
} );
