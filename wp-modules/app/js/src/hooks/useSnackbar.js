// @ts-check

import * as React from 'react';
import { useState, useEffect } from '@wordpress/element';

export default function useSnackbar() {
	/** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
	const [ snackBarValue, setSnackbarValue ] = useState();
	const [ isVisible, setIsVisible ] = useState( false );

	useEffect( () => {
		if ( ! snackBarValue ) {
			return;
		}
		setIsVisible( true );
		setTimeout( () => {
			setIsVisible( false );
			setSnackbarValue( null );
		}, 5000 );
	}, [ snackBarValue ] );

	return {
		isVisible,
		setIsVisible,
		value: snackBarValue,
		setValue: setSnackbarValue,
	};
}
