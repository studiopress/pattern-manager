/**
 * Genesis Studio App
 */

const { __ } = wp.i18n;

import {
	BlockEditorProvider,
	BlockList,
	WritingFlow,
	ObserveTyping,
	BlockEditorKeyboardShortcuts,
	storeConfig as blockEditorStoreConfig,
	BlockInspector,
	BlockBreadcrumb,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import { useDispatch, useCallback } from '@wordpress/data';

import { serialize, parse } from '@wordpress/blocks';

import { getPrefix } from './../non-visual/prefix.js';

import {
	DropZoneProvider,
	SlotFillProvider,
	Slot,
	Popover,
	FormTokenField,
	Snackbar,
} from '@wordpress/components';
import { useContext, useState, useEffect, useRef } from '@wordpress/element';
import { GenesisStudioContext } from './../non-visual/non-visual-logic.js';
import { Modal } from './Modal.js';
import {
	testCollectionForErrors,
	testCollectionsForErrors,
} from './../non-visual/error-tests/error-tests.js';
export function Themes() {
	const { themes } = useContext( GenesisStudioContext );

	function renderThemePicker() {
		const renderedThemes = [];

		console.log( themes );

		for ( const theme in themes.themes ) {
			renderedThemes.push( <div>{ themes.themes[ theme ].name }</div> );
		}

		return renderedThemes;
	}

	return renderThemePicker();
}
