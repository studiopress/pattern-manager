// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';
import useMounted from './useMounted';

export default function useSnackbar() {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ snackBarValue, setSnackbarValue ] = useState();
	const { isMounted } = useMounted();

	useEffect( () => {
		if ( ! snackBarValue ) {
			return;
		}
		setTimeout( () => {
			if ( isMounted() ) {
				setSnackbarValue( null );
			}
		}, 5000 );
	}, [ snackBarValue ] );

	return {
		value: snackBarValue,
		setValue: setSnackbarValue,
	};
}
