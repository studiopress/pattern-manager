<?php
/**
 * Module Name: Prevent Theme Updates
 * Description: This module will prevent a theme from being updated if Pattern Manager has modified it.
 * Namespace: PreventThemeUpdates
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\PreventThemeUpdates;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Prevent a theme update if it's been modified by Pattern Manager.
 *
 * @param mixed  $update_themes_transient_data  Value of site transient.
 * @param string $transient                     Transient name.
 * @return string
 */
function block_theme_updates_if_modified_by_pm( $update_themes_transient_data ) {

	// No update object exists. Return early.
	if ( empty( $update_themes_transient_data ) || ! isset( $update_themes_transient_data->response ) ) {
		return $update_themes_transient_data;
	}

	// Loop through each theme that has an update available.
	foreach ( $update_themes_transient_data->response as $theme_slug => $theme_with_update_available ) {
		$theme_has_been_modified_by_pm = get_option( 'pm_mod_' . $theme_slug );

		if ( $theme_has_been_modified_by_pm ) {
			unset( $update_themes_transient_data->response[ $theme_slug ] );
		}
	}

	return $update_themes_transient_data;
}
add_filter( 'site_transient_update_themes', __NAMESPACE__ . '\block_theme_updates_if_modified_by_pm', 10 );
