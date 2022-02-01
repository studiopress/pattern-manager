/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import { BlockEditorProvider, BlockPreview } from '@wordpress/block-editor';

import { serialize, parse } from '@wordpress/blocks';

import {
	DropZoneProvider,
	SlotFillProvider,
	Slot,
	Popover,
} from '@wordpress/components';
import { useContext, useState, useEffect } from '@wordpress/element';
import { GenesisStudioContext } from './../non-visual/non-visual-logic.js';

export function Collection( props ) {
	const { toolbar, currentCollection } = useContext( GenesisStudioContext );

	return (
		<div
			className="genesisstudio_pattern_preview"
			onClick={ () => {
				currentCollection.set( props.name );
			} }
		>
			<h2>{ props.name }</h2>
		</div>
	);
}
