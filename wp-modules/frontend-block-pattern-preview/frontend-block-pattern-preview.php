<?php
/**
 * Module Name: Frontend Block Pattern Preview
 * Description: This module renders a single block pattern on the frontend, using a specific theme.json file, and rendering through parse_blocks. Usefull for block pattern previews.
 * Namespace: FrontendBlockPatternPreview
 *
 * @package fse-studio
 */

declare(strict_types=1);

namespace FseStudio\FrontendBlockPatternPreview;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function getRenderedBlockPattern( $content, $theme_json_styles ) {
	ob_start();
	?>
	<html>
		<head>
			<title>FSE Studio Block Pattern Preview</title>
			<?php wp_head(); ?>
			<style type="text/css">
				<?php echo $theme_json_styles; ?>
			</style>
		</head>
		<body>
			<?php echo do_the_content_things( $content ); //phpcs:ignore ?>
			<div>
				<?php wp_footer(); ?>
			</div>
		</body>
	</html>
	<?php
	return ob_get_clean();
}
add_action( 'template_redirect', __NAMESPACE__ . '\renderBlockPattern' );

function do_the_content_things( $content ) {

	// Run through the actions that are typically taken on the_content.
	$content = do_blocks( $content );
	$content = wptexturize( $content );
	$content = convert_smilies( $content );
	$content = shortcode_unautop( $content );
	$content = wp_filter_content_tags( $content );
	$content = do_shortcode( $content );

	// Handle embeds for block template parts.
	global $wp_embed;
	$content = $wp_embed->autoembed( $content );

	return $content;
}