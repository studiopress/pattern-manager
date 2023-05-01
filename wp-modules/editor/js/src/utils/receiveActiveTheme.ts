/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { patternManager } from '../globals';
import wasThemeChanged from './wasThemeChanged';

export default function receiveActiveTheme( data: Record< string, unknown > ) {
	if ( wasThemeChanged( data, patternManager.activeTheme ) ) {
		dispatch( 'core/notices' ).createErrorNotice(
			__(
				'Please close this tab. This pattern does not exist in the current theme or the theme was changed since this tab was opened.',
				'pattern-manager'
			),
			{ id: 'pattern-manager-theme-changed' }
		);
	}
}
