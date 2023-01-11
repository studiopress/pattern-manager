<?php
/**
 * Module Name: Site Editor Mods
 * Description: This module enqueues custom javascript and css on the site-editor, allowing for customizations to it.
 * Namespace: SiteEditorMods
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\SiteEditorMods;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Modify certain words when editing a pattern.
 *
 * @param string $translation The translated or modified string.
 * @param string $text The original text we'll change.
 * @param string $domain The text domain of the string in question.
 * @return string
 */
function modify_terms( string $translation, string $text, string $domain ) {
	if ( 'Tags' === $translation ) {
		return 'Pattern Categories';
	}

	return $translation;
}
add_filter( 'gettext', __NAMESPACE__ . '\modify_terms', 10, 3 );
