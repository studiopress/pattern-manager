<?php
/**
 * Module Name: Get Version Control
 * Description: Checks the current theme or wp-content/themes directory for version control.
 * Namespace: GetVersionControl
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\GetVersionControl;

/**
 * Checks for a .git folder in the current theme.
 *
 * @return boolean
 */
function check_for_git_in_theme() {
	$theme_git_dir = get_template_directory() . '/.git';
	return file_exists( $theme_git_dir );
}

/**
 * Checks for a .git folder in the root themes directory.
 *
 * @return boolean
 */
function check_for_git_in_themes_root() {
	$themes_root_git_dir = get_theme_root() . '/.git';
	return file_exists( $themes_root_git_dir ) ? true : false;
}
