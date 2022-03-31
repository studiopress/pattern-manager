// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

export default function useSnackbar() {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ snackBarValue, setSnackbarValue ] = useState();

	useEffect( () => {
		if ( ! snackBarValue ) {
			return;
		}
		setTimeout( () => {
			setSnackbarValue( null );
		}, 5000 );
	}, [ snackBarValue ] );

	return {
		value: snackBarValue,
		setValue: setSnackbarValue,
	};
}
