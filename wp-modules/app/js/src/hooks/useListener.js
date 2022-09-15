import * as React from '@wordpress/element';

/** @param {React.Dispatch<React.SetStateAction<string | undefined>>} setCurrentPatternId */
export default function useListener( setCurrentPatternId ) {
	window.addEventListener( 'message', ( event ) => {
		try {
			const response = JSON.parse( event.data );
			if (
				response.message ===
					'fsestudio_pattern_editor_pattern_name_changed' &&
				response.newPatternName
			) {
				setCurrentPatternId( response.newPatternName );
			}
		} catch ( e ) {}
	} );
}
