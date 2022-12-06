/* eslint-disable no-unused-vars */

import React from 'react';

export default function useListener(
	setCurrentPatternId: React.Dispatch<
		React.SetStateAction< string | undefined >
	>
) {
	window.addEventListener( 'message', ( event: MessageEvent< string > ) => {
		try {
			const data: { message: string; newPatternName: string } =
				JSON.parse( event.data );

			if (
				data.message ===
					'fsestudio_pattern_editor_pattern_name_changed' &&
				data.newPatternName
			) {
				setCurrentPatternId( data.newPatternName );
			}
		} catch ( e: unknown ) {}
	} );
}
