<?php
/**
 * Module Name: LocalWP Data Handlers
 * Description: This module contains functions for getting data from LocalWP, the electron App.
 * Namespace: LocalWpDataHandlers
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\LocalWpDataHandlers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Gets localwp sites data.
 *
 * @return mixed An array of sites found, or false or null if there was a problem.
 */
function get_localwp_sites() {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$path_to_local = get_path_to_localwp();

	if ( ! $path_to_local ) {
		return false;
	}

	$path_to_sites_json = get_path_to_localwp() . 'sites.json';

	if ( ! $wp_filesystem->exists( $path_to_sites_json ) ) {
		return false;
	}

	$sites = json_decode( $wp_filesystem->get_contents( $path_to_sites_json ), true );

	return $sites;
}

/**
 * Get the path to where localwp asset files live.
 *
 * @return mixed The path (string) to the localwp assets directory, if it exists. If not, false.
 */
function get_path_to_localwp() {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	// Try Mac.
	$path_to_local = get_path_to_localwp_on_mac();

	if ( ! $wp_filesystem->exists( $path_to_local ) ) {
		// Try Windows
	}

	if ( ! $wp_filesystem->exists( $path_to_local ) ) {
		// Try Linux
	}

	if ( $wp_filesystem->exists( $path_to_local ) ) {
		return $path_to_local;
	}

	return false;
}

/**
 * Get the path to where localwp asset files live on a mac.
 *
 * @return mixed The path (string) to the localwp assets directory, if it exists. If not, false.
 */
function get_path_to_localwp_on_mac() {
	$path_to_local_parts = explode( '/', getcwd() );

	if ( ! isset( $path_to_local_parts[1] ) || ! isset( $path_to_local_parts[2] ) ) {
		return false;
	}

	$path_to_local = '/' . $path_to_local_parts[1] . '/' . $path_to_local_parts[2] . '/Library/Application Support/Local/';

	return $path_to_local;
}

/**
 * Get whether user tracking has been enabled in Local.
 *
 * @return bool
 */
function user_tracking_enabled() {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$path_to_local = get_path_to_localwp();

	if ( ! $path_to_local ) {
		return false;
	}

	$path_to_data_collection_agreement = get_path_to_localwp() . 'data-collection.json';

	if ( ! $wp_filesystem->exists( $path_to_data_collection_agreement ) ) {
		return false;
	}

	$tracking_agreement = json_decode( $wp_filesystem->get_contents( $path_to_data_collection_agreement ), true );

	if ( ! $tracking_agreement ) {
		return false;
	}

	if ( ! isset( $tracking_agreement['enabled'] ) ) {
		return false;
	}

	if ( ! $tracking_agreement['enabled'] ) {
		return false;
	}

	return true;
}

/**
 * Get the user data for the user logged into LocalWP.
 *
 * @return bool
 */
function get_user_data() {
	$wp_filesystem = \PatternManager\GetWpFilesystem\get_wp_filesystem_api();

	$path_to_local = get_path_to_localwp();

	if ( ! $path_to_local ) {
		return false;
	}

	$path_to_user_profiles = get_path_to_localwp() . 'profiles-hub.json';

	if ( ! $wp_filesystem->exists( $path_to_user_profiles ) ) {
		return false;
	}

	$user_profiles = json_decode( $wp_filesystem->get_contents( $path_to_user_profiles ), true );

	if ( ! $user_profiles ) {
		return false;
	}

	if ( ! isset( $user_profiles[0] ) ) {
		return false;
	}

	return $user_profiles[0];
}
