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
 * Checks for a version control folder in the current theme.
 *
 * @param string $version_control The version control directory to check.
 * @return boolean
 */
function check_for_version_control_in_theme( $version_control = '/.git' ) {
	$theme_git_dir = get_template_directory() . $version_control;
	return file_exists( $theme_git_dir );
}
