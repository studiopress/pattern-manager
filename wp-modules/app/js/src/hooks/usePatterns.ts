import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { patternManager } from '../globals';
import getHeaders from '../utils/getHeaders';
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

	function savePatternsData( patternsToSave: Patterns ) {
		return new Promise( ( resolve ) => {
			setIsSaving( true );

			fetch( patternManager.apiEndpoints.savePatternsEndpoint, {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify( { patterns: patternsToSave } ),
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

	function addPattern( newPattern: Pattern ) {
		return {
			...patternsData,
			[ newPattern.name ]: newPattern,
		};
	}

	function removePattern( patternName: Pattern[ 'name' ] ) {
		const {
			[ patternName ]: {},
			...newPatterns
		} = patternsData;

		return newPatterns;
	}

	return {
		addRef,
		addPattern,
		data: patternsData,
		removePattern,
		isSaving,
		save: savePatternsData,
	};
}
