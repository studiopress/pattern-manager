import * as React from '@wordpress/element';

/** @param {React.Dispatch<React.SetStateAction<string | undefined>>} setCurrentPatternId */
export default function useListener( setCurrentPatternId ) {
	window.addEventListener( 'message', ( event ) => {
		try {
			const data = JSON.parse( event.data );
			if (
				data.message ===
					'fsestudio_pattern_editor_pattern_name_changed' &&
				data.newPatternName
			) {
				setCurrentPatternId( data.newPatternName );
			}
		} catch ( e ) {}
	} );
}
