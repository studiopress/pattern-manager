// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';
import useMounted from './useMounted';

export default function useSnackbar() {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ snackBarValue, setSnackbarValue ] = useState();
	const { isMounted } = useMounted();
	
	function removeSnackbarAfterDelay() {
		if ( ! snackBarValue ) {
			return;
		}
		setTimeout( () => {
			if ( isMounted() ) {
				setSnackbarValue( null );
			}
		}, 7000 );
	}

	useEffect( () => {
		removeSnackbarAfterDelay();
	}, [ snackBarValue ] );

	return {
		value: snackBarValue,
		setValue: setSnackbarValue,
	};
}
