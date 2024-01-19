<?php
/**
 * Module Name: Get Environment
 * Description: Checks the site environment to determine if it is locally hosted.
 * Namespace: GetEnviroment
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\GetEnviroment;

/**
 * Gets the meta key for storing environment notice dismissals.
 *
 * @return string
 */
function get_environment_meta_key() {
	return 'patternmanager_environment_notice_dismissed_sites';
}

/**
 * Gets the list of sites that have had environment notices dismissed by the user.
 *
 * @return array
 */
function get_dismissed_sites() {
	$dismissed_sites = get_user_meta( get_current_user_id(), get_environment_meta_key(), true );
	return ! empty( $dismissed_sites ) ? $dismissed_sites : [];
}

/**
 * Determines if the environment notice should be displayed.
 *
 * @param string $site_id The site id to check against previously dismissed sites.
 * @param string $environment The environment type to check against.
 * @return boolean
 */
function check_environment_notice_should_show( $site_id, $environment ) {

	// If this is a local environment, no notice needed.
	if ( 'local' === $environment ) {
		return false;
	}

	// If the notice has already been dismissed, no notice needed.
	if ( check_site_dismissed( $site_id ) ) {
		return false;
	}

	// If this is a production site, and the notice has not been dismissed, notice needed.
	return true;
}

/**
 * Checks if the environment notice has already been dismissed for a given site.
 *
 * @param string $site_id The site id to check against.
 * @return boolean
 */
function check_site_dismissed( $site_id ) {
	return in_array( $site_id, get_dismissed_sites(), true );
}
