import { useState } from '@wordpress/element';
import type { Themes } from '../types';

export default function useThemes( themes: Themes ) {
	const [ theThemes, setTheThemes ] = useState( themes );

	return {
		themes: theThemes,
		setThemes: setTheThemes,
	};
}
