/**
 * Genesis Studio App.
 */

export function getPrefix( plugin ) {
	if ( ! plugin ) {
		return 'gb';
	}

	let prefix = '';
	if ( plugin === 'genesis_page_builder' ) {
		prefix = 'gpb';
	}
	if ( plugin === 'genesis_blocks' ) {
		prefix = 'gb';
	}
	if ( plugin === 'wpeshopinabox' ) {
		prefix = 'eso';
	}

	return prefix;
}
