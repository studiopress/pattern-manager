import { useState } from '@wordpress/element';

/**
 * @typedef {{
 *  value: string,
 *  set: Function
 * }} CurrentId
 */

/**
 * @param {string} [initialId]
 * @return {CurrentId} The current ID and a way to change it.
 */
export function useCurrentId( initialId ) {
	const [ value, set ] = useState( initialId );

	return {
		value,
		set,
	};
}
