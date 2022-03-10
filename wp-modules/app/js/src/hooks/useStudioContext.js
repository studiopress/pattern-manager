// @ts-check

import { useContext } from '@wordpress/element';
import FseStudioContext from '../contexts/FseStudioContext';

/**
 * @return {import('../').InitialContext | undefined} The FSE Studio context.
 */
export default function useStudioContext() {
	const context = useContext( FseStudioContext );
	if ( ! context ) {
		throw new Error( 'useStudioContext must be inside a provider' );
	}

	return context;
}
