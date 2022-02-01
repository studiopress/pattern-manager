<?php
/**
 * Frost: Footer with text, links.
 *
 * @package fse-theme-manager
 */

return array(
	'title'         => __( 'Footer with text, links.', 'frost' ),
	'name'          => 'frost-footer-default-black-background',
	'categories'    => array( 'frost-footer' ),
	'viewportWidth' => 1280,
	'content'       => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"backgroundColor":"black","textColor":"white","className":"has-small-font-size","layout":{"inherit":true}} -->
<div class="wp-block-group alignfull has-small-font-size has-white-color has-black-background-color has-text-color has-background has-link-color" style="padding-top:40px;padding-bottom:40px"><!-- wp:group {"align":"wide","layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:paragraph -->
<p>© 2022 Your Company LLC · <a href="#">Contact Us</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="#">Facebook</a>&nbsp;·&nbsp;<a href="#">Twitter</a>&nbsp;·&nbsp;<a href="#">Instagram</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
);
