import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../../../../pattern-post-type/js/src/utils/getHeaders';
import { Pattern, Patterns } from '../types';

export default function usePatterns( initialPatterns: Patterns ) {
	const [ isSaving, setIsSaving ] = useState( false );
	const [ patternsData, setPatternsData ] = useState( initialPatterns );

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

	function savePatternsData() {
		return new Promise( ( resolve ) => {
			setIsSaving( true );

			fetch( patternManager.apiEndpoints.savePatternsEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( { patterns: patternsData } ),
			} )
				.then( ( response ) => {
					if ( ! response.ok ) {
						throw response.statusText;
					}
					return response.json();
				} )
				.then( ( data: { patterns: Patterns } ) => {
					setPatternsData( data.patterns );

					uponSuccessfulSave();

					resolve( data );
				} );
		} );
	}

	function uponSuccessfulSave() {
		editorDirty.current = false;
		setIsSaving( false );
		reloadPatternPreviews();
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
		isSaving,
		save: savePatternsData,
		set: editPatterns,
	};
}
