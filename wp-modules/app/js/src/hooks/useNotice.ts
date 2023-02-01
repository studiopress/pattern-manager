import { useState, useEffect } from '@wordpress/element';
import useMounted from './useMounted';

export default function useNotice() {
	const [ notice, setNotice ] = useState( '' );
	const { isMounted } = useMounted();

	function removeNoticeAfterDelay() {
		if ( ! notice ) {
			return;
		}
		setTimeout( () => {
			if ( isMounted() ) {
				setNotice( '' );
			}
		}, 7000 );
	}

	useEffect( () => {
		removeNoticeAfterDelay();
	}, [ notice ] );

	return {
		value: notice,
		set: setNotice,
	};
}
