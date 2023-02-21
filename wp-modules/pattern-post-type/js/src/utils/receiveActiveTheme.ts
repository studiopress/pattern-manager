/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { patternManager } from '../globals';

export default function receiveActiveTheme( data: Record< string, unknown > ) {
	if ( wasThemeChanged( data, patternManager.activeTheme ) ) {
		dispatch( 'core/notices' ).createErrorNotice(
			__(
				'Please close this tab, as the theme was changed. This pattern does not exist in this theme.',
				'pattern-manager'
			),
			{ id: 'pattern-manager-theme-changed' }
		);
	}
}

export function wasThemeChanged(
	data: Record< string, unknown >,
	originalTheme: typeof patternManager.activeTheme
) {
	return !! data.activeTheme && data.activeTheme !== originalTheme;
}
