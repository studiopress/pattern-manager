import { useState } from '@wordpress/element';

export default function useNotice() {
	const [ notice, setNotice ] = useState( '' );

	return {
		value: notice,
		set: setNotice,
	};
}
