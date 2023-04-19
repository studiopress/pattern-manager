<?php
/**
 * Module Name: Block
 * Description: Logic for the block.
 * Namespace: Block
 *
 * @package pattern-manager
 */

declare(strict_types=1);

namespace PatternManager\Block;

use function PatternManager\Editor\do_the_content_things;
use function PatternManager\PatternDataHandlers\get_pattern_by_name;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the PM Pattern Block.
 *
 * @param string $block_content The rendered block.
 * @param array $block The block.
 * @return string Rendered block content.
 */
function render_pm_pattern_block( $block_content, $block ) {
	return isset( $block['blockName'], $block['attrs']['slug'] ) &&
		'core/pattern' === $block['blockName'] && filter_input( INPUT_GET, 'is_pm_pattern' )
			? do_the_content_things( get_pattern_by_name( $block['attrs']['slug'] )['content'] ?? '' )
			: $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_pm_pattern_block', 10, 2 );
