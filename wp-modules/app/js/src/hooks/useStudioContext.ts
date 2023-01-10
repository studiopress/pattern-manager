import { useContext } from '@wordpress/element';
import PatternManagerContext from '../contexts/PatternManagerContext';

export default function useStudioContext() {
	const context = useContext(PatternManagerContext);
	if (!context) {
		throw new Error('useStudioContext must be inside a provider');
	}

	return context;
}
