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
				'The theme was changed. This pattern does not exist in this theme. Please close this tab.',
				'pattern-manager'
			),
			{ id: 'pattern-manager-theme-changed' }
		);
	}
}
