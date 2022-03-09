import { useState } from '@wordpress/element';

/**
 * @param {string} [initial]
 * @return {{
 *  value: string,
 *  set: Function
 * }} The current ID and a way to change it.
 */
export function useCurrentId( initial ) {
	const [ value, set ] = useState( initial );

	return {
		value,
		set,
	};
}
