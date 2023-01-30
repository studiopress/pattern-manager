import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../../../../pattern-post-type/js/src/utils/getHeaders';
import { Pattern, Patterns } from '../types';
import type useNotice from './useNotice';

export default function usePatterns(
	initialPatterns: Patterns,
	notice: ReturnType< typeof useNotice >
) {
	const [ isSaving, setIsSaving ] = useState( false );
	const [ fetchInProgress, setFetchInProgress ] = useState( false );
	const [ patternsData, setPatternsData ] = useState( initialPatterns );
	const [ makeItSaveStaleWorkaround, setMakeItSaveStaleWorkaround ] =
		useState( false );

	const editorDirty = useRef( false );

	const refs = useRef< { [ key: string ]: HTMLIFrameElement } >( {} );

	const addRef = ( key: string, newRef: HTMLIFrameElement ) => {
		refs.current[ key ] = newRef;
	};
	const reloadPatternPreviews = () => {
		Object.values( refs.current ).forEach( ( ref ) => {
			ref?.contentWindow?.location.reload();
		} );
	};

	/**
	 * Warns the user if there are unsaved changes before leaving.
	 *
	 * Forked from Gutenberg: https://github.com/WordPress/gutenberg/blob/5d5e97abd5e082050fdbb88bb1c93f9dbe10a23b/packages/editor/src/components/unsaved-changes-warning/index.js
	 */
	function warnIfUnsavedChanges( event: Event ) {
		if ( editorDirty.current ) {
			// @ts-expect-error: returnvalue is deprecated, but preventDefault() isn't always enough to prevent navigating away from the page.
			event.returnValue = __(
				'Are you sure you want to leave the editor? There are unsaved changes.',
				'pattern-manager'
			);
			event.preventDefault();
		}
	}

	function createPattern( newPattern: Pattern ) {
		setPatternsData( {
			...patternsData,
			[ newPattern.name ]: newPattern,
		} );
	}

	function deletePattern( patternName: Pattern[ 'name' ] ) {
		if (
			/* eslint-disable no-alert */
			! window.confirm(
				__(
					'Are you sure you want to delete this pattern?',
					'pattern-manager'
				)
			)
		) {
			return;
		}

		const {
			[ patternName ]: {},
			...newPatterns
		} = patternsData;

		setPatternsData( newPatterns );
	}

	/**
	 * Allows the user to edit the patterns.
	 *
	 * A separate function from setPatternsData(), as this sets the 'dirty'
	 * state of the editor.
	 */
	function editPatterns( newPatterns: Patterns ) {
		editorDirty.current = true;
		setPatternsData( newPatterns );
	}

	return {
		addRef,
		createPattern,
		data: patternsData,
		deletePattern,
		fetchInProgress,
		isSaving,
		set: editPatterns,
	};
}
