<?php
/**
 * Module Name: Get Version Control
 * Description: Checks the current theme directory for version control.
 * Namespace: GetVersionControl
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\GetVersionControl;

/**
 * Gets the meta key for storing version control notice dismissals.
 *
 * @return string
 */
function get_version_control_meta_key() {
	return 'patternmanager_version_control_notice_dismissed_themes';
}

/**
 * Gets the list of themes that have had version control notices dismissed by the user.
 *
 * @return array
 */
function get_dismissed_themes() {
	$dismissed_themes = get_user_meta( get_current_user_id(), get_version_control_meta_key(), true );
	return ! empty( $dismissed_themes ) ? $dismissed_themes : [];
}

/**
 * Determines if the version control notice should be displayed.
 *
 * @param string $theme_name The theme name to check against previously dismissed notices.
 * @param string $version_control The version control directory to check.
 * @return boolean
 */
function check_version_control_notice_should_show( $theme_name, $version_control = '/.git' ) {
	return ! check_theme_name_dismissed( $theme_name ) && ! check_for_version_control_in_theme( $version_control );
}

/**
 * Checks for a version control folder in the current theme.
 *
 * @param string $version_control The version control directory to check.
 * @return boolean
 */
function check_for_version_control_in_theme( $version_control ) {
	return file_exists( get_template_directory() . $version_control );
}

/**
 * Checks if the version control notice has already been dismissed for a given theme.
 *
 * @param string $theme_name The theme name.
 * @return boolean
 */
function check_theme_name_dismissed( $theme_name ) {
	return in_array( $theme_name, get_dismissed_themes(), true );
}
