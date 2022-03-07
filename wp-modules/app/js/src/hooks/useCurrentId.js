import { useState } from '@wordpress/element';

export function useCurrentId( initial ) {
	const [ value, set ] = useState( initial );

	return {
		value,
		set,
	};
}
