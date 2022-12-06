import { useContext } from '@wordpress/element';
import FseStudioContext from '../contexts/FseStudioContext';

export default function useStudioContext() {
	const context = useContext( FseStudioContext );
	if ( ! context ) {
		throw new Error( 'useStudioContext must be inside a provider' );
	}

	return context;
}
