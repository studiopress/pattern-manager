// @ts-check

import { useContext } from '@wordpress/element';
import SnackbarContext from '../contexts/FseStudioSnackbarContext';

/** @return {ReturnType<import('./useSnackbar')>} The FSE Studio context. */
export default function useSnackbarContext() {
	const context = useContext( SnackbarContext );
	if ( ! context ) {
		throw new Error( 'useSnackbarContext must be inside a provider' );
	}

	return context;
}
