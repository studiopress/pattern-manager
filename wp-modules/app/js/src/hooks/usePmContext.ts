import { useContext } from '@wordpress/element';
import PatternManagerContext from '../contexts/PatternManagerContext';

export default function usePmContext() {
	const context = useContext( PatternManagerContext );
	if ( ! context ) {
		throw new Error( 'usePmContext must be inside a provider' );
	}

	return context;
}
