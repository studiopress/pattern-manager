// @ts-check

import * as React from 'react';
import { useState, useEffect, useRef } from '@wordpress/element';

export default function useSnackbar() {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ snackBarValue, setSnackbarValue ] = useState( '' );
	const mountedRef = useRef( false );

	useEffect( () => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	} );

	useEffect( () => {
		if ( ! snackBarValue ) {
			return;
		}
		setTimeout( () => {
			if ( mountedRef.current ) {
				setSnackbarValue( null );
			}
		}, 5000 );
	}, [ snackBarValue ] );

	return {
		value: snackBarValue,
		setValue: setSnackbarValue,
	};
}
