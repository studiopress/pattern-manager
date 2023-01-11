<?php
/**
 * Module Name: Theme Data Handlers
 * Description: This module contains functions for getting and saving theme data.
 * Namespace: ThemeDataHandlers
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\ThemeDataHandlers;

use WP_REST_Response;
use function switch_theme;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Update a single theme.
 *
 * @param array $patterns The new patterns.
 * @param bool $update_patterns Whether we should update patterns as part of this, or not. Note that when in the UI/App, patterns will save themselves after this is done, so we don't need to save patterns here, which is why this boolean option exists.
 * @return array
 */
function update_patterns( $patterns ) {
	\PatternManager\PatternDataHandlers\delete_patterns_not_present( $patterns );

	foreach ( $patterns as $pattern_name => $pattern ) {
		\PatternManager\PatternDataHandlers\update_pattern( $pattern );
	}

	// Now that all patterns have been saved, remove any images no longer needed in the theme.
	\PatternManager\PatternDataHandlers\tree_shake_theme_images();

	return $patterns;
}
